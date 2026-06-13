import { supabase } from './src/lib/supabase.js';

const SEED_PLACES = [
  { title: 'Borra Caves', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600', rank: 1, published: true },
  { title: 'Katiki Waterfalls', image: 'https://images.unsplash.com/photo-1432405261166-8822acea547a?auto=format&fit=crop&q=80&w=600', rank: 2, published: true },
  { title: 'Coffee Museum', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600', rank: 3, published: true },
  { title: 'Tribal Museum', image: 'https://images.unsplash.com/photo-1515444744559-7be63e1600de?auto=format&fit=crop&q=80&w=600', rank: 4, published: true },
  { title: 'Padmapuram Gardens', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600', rank: 5, published: true },
  { title: 'Chaparai Waterfalls', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600', rank: 6, published: true },
  { title: 'Ananthagiri Hills', image: '/visakhapatnam-araku-valley.jpg', rank: 7, published: true },
  { title: 'Galikonda Viewpoint', image: '/vanajangi.jpg', rank: 8, published: true },
];

async function seed() {
  const { data: existing, error: readErr } = await supabase
    .from('must_visit_places')
    .select('id')
    .limit(1);

  if (readErr) {
    console.error('Table must_visit_places not found. Run must_visit_places_setup.sql in Supabase SQL Editor first.');
    console.error(readErr.message);
    process.exit(1);
  }

  if (existing?.length > 0) {
    console.log('must_visit_places already has data — skipping seed.');
    const { data } = await supabase.from('must_visit_places').select('title, rank').order('rank');
    console.log(data);
    return;
  }

  const { data, error } = await supabase.from('must_visit_places').insert(SEED_PLACES).select();
  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  console.log('Seeded', data.length, 'must visit places:');
  data.forEach(p => console.log(`  #${p.rank} ${p.title}`));
}

seed();
