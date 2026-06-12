import { supabase } from './src/lib/supabase.js';

async function addColumns() {
  try {
    // First, check if columns already exist
    const { data: packages, error: selectError } = await supabase
      .from('packages')
      .select('rating, reviewCount')
      .limit(1);

    if (selectError && selectError.message.includes('rating')) {
      console.log('Rating column missing, adding...');
      
      // Add rating column
      const { error: ratingError } = await supabase.rpc('add_rating_column');
      if (ratingError) {
        console.log('Note: Could not add via RPC. Please add manually via Supabase console.');
        console.log('Run this SQL in Supabase SQL Editor:');
        console.log(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT NULL;`);
        console.log(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER DEFAULT 0;`);
      } else {
        console.log('Rating column added successfully');
      }
    } else {
      console.log('Columns already exist or accessible');
    }

    // Fetch packages to verify
    const { data, error } = await supabase
      .from('packages')
      .select('id, name, rating, reviewCount')
      .limit(1);

    if (error) {
      console.log('Error:', error.message);
      console.log('\n📋 To fix this manually, go to Supabase Console and run:');
      console.log(`
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT NULL;

ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER DEFAULT 0;
      `);
    } else {
      console.log('✅ Columns verified:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

addColumns();
