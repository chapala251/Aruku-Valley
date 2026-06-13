-- Must Visit Places table + seed data
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS must_visit_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  rank INTEGER DEFAULT 1,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE must_visit_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read must_visit_places"
  ON must_visit_places FOR SELECT
  USING (published = true);

CREATE POLICY "Admin full access must_visit_places"
  ON must_visit_places FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO must_visit_places (title, image, rank, published) VALUES
  ('Borra Caves', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600', 1, true),
  ('Katiki Waterfalls', 'https://images.unsplash.com/photo-1432405261166-8822acea547a?auto=format&fit=crop&q=80&w=600', 2, true),
  ('Coffee Museum', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600', 3, true),
  ('Tribal Museum', 'https://images.unsplash.com/photo-1515444744559-7be63e1600de?auto=format&fit=crop&q=80&w=600', 4, true),
  ('Padmapuram Gardens', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600', 5, true),
  ('Chaparai Waterfalls', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600', 6, true),
  ('Ananthagiri Hills', '/visakhapatnam-araku-valley.jpg', 7, true),
  ('Galikonda Viewpoint', '/vanajangi.jpg', 8, true);
