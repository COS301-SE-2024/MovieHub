const dotenv = require("dotenv")
dotenv.config()
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://smpxgyiogmxexcsfkkuz.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY_QUOTE;
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };