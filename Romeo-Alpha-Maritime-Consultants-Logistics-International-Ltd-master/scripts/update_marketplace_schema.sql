-- SQL Script to update the public.marketplace_items table in Supabase
-- This script does the following:
-- 1. Drops the columns no longer needed (image_url, location, tags, availability)
-- 2. Adds the new 'position' column to store vessel locations
-- 3. Ensures the 'gallery' column exists (as a text array) to store image URLs

-- Step 1: Drop unused and deprecated columns safely
ALTER TABLE public.marketplace_items DROP COLUMN IF EXISTS image_url;
ALTER TABLE public.marketplace_items DROP COLUMN IF EXISTS location;
ALTER TABLE public.marketplace_items DROP COLUMN IF EXISTS tags;
ALTER TABLE public.marketplace_items DROP COLUMN IF EXISTS availability;

-- Step 2: Add the new 'position' column
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS position TEXT;

-- Step 3: Ensure the 'gallery' column exists to store item image arrays
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
