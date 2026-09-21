-- SQL migration to rename position column to location in public.marketplace_items
ALTER TABLE public.marketplace_items RENAME COLUMN position TO location;
