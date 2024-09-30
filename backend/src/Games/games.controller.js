
const { createClient } = require('@supabase/supabase-js');
const dotenv = require("dotenv");
dotenv.config();

const supabaseUrl = "https://smpxgyiogmxexcsfkkuz.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY_QUOTE;
const supabase = createClient(supabaseUrl, supabaseKey);


const supabase = require('../supabase');

const fetchQuotesByGenre = async (genre) => {
    const { data, error } = await supabase
        .from('quotes')
        .select('quote, movie, genre')
        .eq('genre', genre);

    if (error) {
        throw new Error('Error fetching quotes: ' + error.message);
    }

    return data;
};

module.exports = { fetchQuotesByGenre };