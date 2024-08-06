const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();
//const supabase = require("./supabaseQuoteClient");

// import express from 'express';
// const router = express.Router();


const supabaseUrl = "https://smpxgyiogmxexcsfkkuz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcHhneWlvZ214ZXhjc2Zra3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNzQ0MDksImV4cCI6MjAzNTk1MDQwOX0.gnVUUMsFOHHTukiq2jJNZjtJtkDYePSBKvsswrv_r-I";
const supabase = createClient(supabaseUrl, supabaseKey);

// const app = express();
// const port = 5050;

// //Rate limiting configuration
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
// });

// app.use(limiter);
// app.use(bodyParser.json());

// console.log(process.env.SUPABASE_KEY);
exports.getMovieByQuote = async (quote) => {
    console.log("Request body:", quote);

    try{
    const { data, error } = await supabase.from("movieQuotes").select().ilike("quote", `%${quote}%`).limit(5);
    //console.log(data);
    return data;
    } catch (error) {
        console.error("Error getting total comments of post: ", error);
        throw error;
    }
};

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

//module.exports = app;