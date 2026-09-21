-- SQL Script to update the public.marketplace_items table in Supabase
-- This script does the following:
-- 1. Drops the columns no longer needed (image_url, tags, availability)
-- 2. Adds the new 'location' column to store vessel locations (or renames 'position' if present)
-- 3. Ensures the 'gallery' column exists (as a text array) to store image URLs

-- Step 1: Drop unused and deprecated columns safely
ALTER TABLE public.marketplace_items DROP COLUMN IF EXISTS image_url;
ALTER TABLE public.marketplace_items DROP COLUMN IF EXISTS tags;
ALTER TABLE public.marketplace_items DROP COLUMN IF EXISTS availability;

-- Step 2: Rename 'position' to 'location' if it exists, otherwise add 'location'
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='marketplace_items' AND column_name='position') THEN
        ALTER TABLE public.marketplace_items RENAME COLUMN position TO location;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='marketplace_items' AND column_name='location') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN location TEXT;
    END IF;
END $$;

-- Step 3: Ensure the 'gallery' column exists to store item image arrays
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
