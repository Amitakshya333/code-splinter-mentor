-- Relax RLS policies on feedback table to allow anonymous feedback creation and viewing

-- Drop existing restrictive policies tied to auth.uid()
DROP POLICY IF EXISTS "Users can create their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can update their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;

-- Allow anyone (including anonymous users) to insert feedback
CREATE POLICY "Anyone can insert feedback"
ON public.feedback
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone (including anonymous users) to view feedback
CREATE POLICY "Anyone can view feedback"
ON public.feedback
FOR SELECT
TO public
USING (true);