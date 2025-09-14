-- RLS extensions: add missing DELETE policies and enforce public visibility guards

-- Videos: allow owners to delete own videos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'videos' AND policyname = 'Users can delete own videos'
  ) THEN
    EXECUTE 'DROP POLICY "Users can delete own videos" ON public.videos';
  END IF;
END $$;

CREATE POLICY "Users can delete own videos"
ON public.videos
FOR DELETE
USING (auth.uid() = creator_id);

-- Comments: allow owners to delete own comments
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'comments' AND policyname = 'Users can delete own comments'
  ) THEN
    EXECUTE 'DROP POLICY "Users can delete own comments" ON public.comments';
  END IF;
END $$;

CREATE POLICY "Users can delete own comments"
ON public.comments
FOR DELETE
USING (auth.uid() = user_id);

-- Re-affirm public visibility filters (idempotent replace)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'videos' AND policyname = 'Public videos are viewable by everyone'
  ) THEN
    EXECUTE 'DROP POLICY "Public videos are viewable by everyone" ON public.videos';
  END IF;
END $$;

CREATE POLICY "Public videos are viewable by everyone"
ON public.videos
FOR SELECT
USING (status = 'active');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Public products are viewable by everyone'
  ) THEN
    EXECUTE 'DROP POLICY "Public products are viewable by everyone" ON public.products';
  END IF;
END $$;

CREATE POLICY "Public products are viewable by everyone"
ON public.products
FOR SELECT
USING (is_active = TRUE);


