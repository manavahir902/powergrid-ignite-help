-- Create enum types
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_category AS ENUM ('network', 'account', 'email', 'hardware', 'software', 'printer', 'other');
CREATE TYPE user_role AS ENUM ('employee', 'it_admin', 'it_support', 'manager');

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  department text,
  phone text,
  role user_role DEFAULT 'employee',
  gamification_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "IT admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('it_admin', 'manager')
    )
  );

-- Tickets table
CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category ticket_category NOT NULL,
  priority ticket_priority DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  location text,
  urgency_flag boolean DEFAULT false,
  assigned_to uuid REFERENCES profiles(id),
  ai_suggestions jsonb,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets" ON tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "IT staff can view all tickets" ON tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('it_admin', 'it_support', 'manager')
    )
  );

CREATE POLICY "IT staff can update tickets" ON tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('it_admin', 'it_support', 'manager')
    )
  );

-- Knowledge Base table
CREATE TABLE knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category ticket_category NOT NULL,
  keywords text[],
  view_count integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view KB articles" ON knowledge_base
  FOR SELECT USING (true);

CREATE POLICY "IT admins can manage KB" ON knowledge_base
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'it_admin'
    )
  );

-- Chat messages table
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  message text NOT NULL,
  response text,
  suggested_kb_id uuid REFERENCES knowledge_base(id),
  created_ticket_id uuid REFERENCES tickets(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ticket comments table
CREATE TABLE ticket_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  comment text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on their tickets" ON ticket_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE id = ticket_id 
      AND user_id = auth.uid()
      AND NOT is_internal
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('it_admin', 'it_support', 'manager')
    )
  );

CREATE POLICY "Users can add comments to their tickets" ON ticket_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE id = ticket_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "IT staff can add comments" ON ticket_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('it_admin', 'it_support', 'manager')
    )
  );

-- Gamification events table
CREATE TABLE gamification_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  event_type text NOT NULL,
  points integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gamification_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events" ON gamification_events
  FOR SELECT USING (auth.uid() = user_id);

-- Function to update ticket timestamp
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status IN ('resolved', 'closed') AND OLD.status NOT IN ('resolved', 'closed') THEN
    NEW.resolved_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ticket_timestamp_trigger
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_timestamp();

-- Function to award gamification points
CREATE OR REPLACE FUNCTION award_points(p_user_id uuid, p_points integer, p_event_type text, p_description text)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET gamification_points = gamification_points + p_points WHERE id = p_user_id;
  INSERT INTO gamification_events (user_id, event_type, points, description) 
  VALUES (p_user_id, p_event_type, p_points, p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for performance
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX idx_kb_category ON knowledge_base(category);
CREATE INDEX idx_kb_keywords ON knowledge_base USING gin(keywords);