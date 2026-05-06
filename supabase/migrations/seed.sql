-- SEED DATA FOR TOMORROW OS TESTING
-- Run this in your Supabase SQL Editor

-- 1. Create Test Users in Auth (Password: password123)
-- This will automatically trigger profile creation via your handle_new_user() function
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, instance_id, aud, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'alpha@test.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"username":"alpha_warrior"}', now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'beta@test.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"username":"beta_focus"}', now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', 'gamma@test.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"username":"gamma_grind"}', now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 2. Update Profiles with Stats
UPDATE public.profiles SET nickname = 'Alpha Beast', total_points = 1540, weekly_points = 420, current_streak = 5, longest_streak = 14 WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE public.profiles SET nickname = 'Beta Focus', total_points = 2850, weekly_points = 950, current_streak = 21, longest_streak = 21 WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE public.profiles SET nickname = 'Gamma Ray', total_points = 890, weekly_points = 150, current_streak = 2, longest_streak = 8 WHERE id = '00000000-0000-0000-0000-000000000003';

-- 3. Insert Public Tasks (for the Global Feed)
INSERT INTO public.tasks (user_id, title, description, planned_for, target_points, actual_points, scored_at, is_public)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'Morning Meditation', '20 mins of mindfulness', current_date, 3, 3, now(), true),
  ('00000000-0000-0000-0000-000000000002', 'Write 1000 words', 'Drafting Chapter 4 of the book', current_date, 5, 4, now(), true),
  ('00000000-0000-0000-0000-000000000001', 'Gym Session', 'Leg day + 20min cardio', current_date, 4, 4, now(), true),
  ('00000000-0000-0000-0000-000000000003', 'Study Rust', 'Borrow checker and lifetimes', current_date, 5, 2, now(), true);

-- 4. Insert Historical Data (for Heatmap and Stats)
-- This creates data for the last 5 days for Beta Focus
INSERT INTO public.daily_summaries (user_id, date, total_tasks, scored_tasks, total_possible, total_earned)
VALUES
  ('00000000-0000-0000-0000-000000000002', current_date - 1, 3, 3, 12, 12),
  ('00000000-0000-0000-0000-000000000002', current_date - 2, 4, 4, 15, 14),
  ('00000000-0000-0000-0000-000000000002', current_date - 3, 2, 2, 10, 8),
  ('00000000-0000-0000-0000-000000000002', current_date - 4, 5, 5, 20, 20),
  ('00000000-0000-0000-0000-000000000002', current_date - 5, 3, 3, 15, 15)
ON CONFLICT (user_id, date) DO NOTHING;
