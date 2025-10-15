-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('employee', 'it_support', 'admin');

-- Create user_roles table (CRITICAL: Roles must be in separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policy for user_roles: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS policy: Admins can manage all roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create chat_history table for contextual conversations
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  context_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on chat_history
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- RLS policy: Users can view their own chat history
CREATE POLICY "Users can view their own chat history"
ON public.chat_history
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS policy: Users can insert their own chat history
CREATE POLICY "Users can insert their own chat history"
ON public.chat_history
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update tickets table RLS for IT Support role
DROP POLICY IF EXISTS "IT staff can view all tickets" ON public.tickets;
DROP POLICY IF EXISTS "IT staff can update tickets" ON public.tickets;

CREATE POLICY "IT Support and Admin can view all tickets"
ON public.tickets
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'it_support') OR 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "IT Support and Admin can update tickets"
ON public.tickets
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'it_support') OR 
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'it_support') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Update knowledge_base RLS for admins
DROP POLICY IF EXISTS "IT admins can manage KB" ON public.knowledge_base;

CREATE POLICY "Admins can manage KB"
ON public.knowledge_base
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));