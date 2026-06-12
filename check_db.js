import { supabase } from './src/lib/supabase.js';

async function check() {
  const { data: vData, error: vErr } = await supabase.from('vehicles').select('*').limit(1);
  console.log('VEHICLES:', vData, vErr);

  const { data: tData, error: tErr } = await supabase.from('things_to_do').select('*').limit(1);
  console.log('THINGS_TO_DO:', tData, tErr);
}

check();
