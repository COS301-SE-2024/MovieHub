const { createClient } = require('@supabase/supabase-js');
const dotenv = require("dotenv");
dotenv.config();

const supabaseUrl = "https://smpxgyiogmxexcsfkkuz.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY_QUOTE;
const supabase = createClient(supabaseUrl, supabaseKey);

const fetchQuotesByGenre = async (genre) => {
    console.log("genre:", genre)
    const { data, error } = await supabase
        .from('movieQuotes_duplicate') // Table name
        .select('quote, movie, genre')
        .ilike('genre', `%${genre}%`);

    if (error) {
        throw new Error('Error fetching quotes: ' + error.message);
    }

    return data;
    
};

const fetchAllMovies = async () => {
    const { data, error } = await supabase
        .from('movieQuotes_duplicate') 
        .select('movie')
        .limit(20); 

    if (error) {
        throw new Error('Error fetching all movies: ' + error.message);
    }


   
    return data; 
};

module.exports = {
    fetchQuotesByGenre,
    fetchAllMovies
};