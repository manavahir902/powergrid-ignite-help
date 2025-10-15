-- Fix search_path for existing functions to prevent security issues

-- Fix update_ticket_timestamp function
CREATE OR REPLACE FUNCTION public.update_ticket_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status IN ('resolved', 'closed') AND OLD.status NOT IN ('resolved', 'closed') THEN
    NEW.resolved_at = now();
  END IF;
  RETURN NEW;
END;
$$;

-- Fix award_points function
CREATE OR REPLACE FUNCTION public.award_points(p_user_id UUID, p_points INTEGER, p_event_type TEXT, p_description TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles SET gamification_points = gamification_points + p_points WHERE id = p_user_id;
  INSERT INTO gamification_events (user_id, event_type, points, description) 
  VALUES (p_user_id, p_event_type, p_points, p_description);
END;
$$;