// src/games/games.services.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = "https://smpxgyiogmxexcsfkkuz.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY_QUOTE; // Set this in your .env
const supabase = createClient(supabaseUrl, supabaseKey);
const { fetchQuotesByGenre } = require('./games.controller');


// Common words to exclude from fill-in-the-blank questions
const commonWords = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "as", "at", "be", "because", "been", "before", "being", "below",
    "between", "both", "but", "by", "for", "from", "further", "had", "has", "have",
    "he", "her", "here", "him", "his", "how", "i", "if", "in", "into", "is", "it",
    "its", "just", "me", "might", "more", "most", "much", "my", "no", "not", "of",
    "off", "on", "once", "only", "or", "other", "our", "out", "over", "own", "said",
    "same", "she", "should", "so", "some", "such", "t", "than", "that", "the", "their",
    "them", "then", "there", "these", "they", "this", "those", "through", "to", "too",
    "under", "until", "up", "us", "very", "was", "we", "were", "what", "when", "where",
    "which", "while", "who", "whom", "why", "will", "with", "would", "you", "your" ,"i am", "it's"
]);

// Function to create fill-in-the-blank questions with a hint
function createFillInTheBlank(quote) {
    const words = quote.split(" ");
    const filteredWords = words.filter(word => !commonWords.has(word.toLowerCase()));

    if (filteredWords.length === 0) {
        throw new Error("No suitable words to remove.");
    }

    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const wordToRemove = filteredWords[randomIndex];
    const modifiedQuote = quote.replace(wordToRemove, "______");

    return {
        type: "fill-in-blank",
        question: modifiedQuote,
        answer: wordToRemove,
        hint: "", // Placeholder for hint
    };
}


// Function to create multiple-choice questions
function createMultipleChoiceQuestion(quote, correctMovie, allMovies) {
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const incorrectMovies = allMovies.filter(movie => movie !== correctMovie);
    if (incorrectMovies.length < 3) {
        throw new Error("Not enough unique movies for options.");
    }

    const selectedIncorrectMovies = [];
    while (selectedIncorrectMovies.length < 3) {
        const randomIndex = Math.floor(Math.random() * incorrectMovies.length);
        const movie = incorrectMovies[randomIndex];
        if (!selectedIncorrectMovies.includes(movie)) {
            selectedIncorrectMovies.push(movie);
        }
    }

    const options = shuffleArray([correctMovie, ...selectedIncorrectMovies]);

    return {
        question: `What movie is this quote from: "${quote}"?`,
        options: options,
        answer: correctMovie,
    };
}


const getGameData = async (genre) => {
    console.log(genre);
    const quotes = await fetchQuotesByGenre(genre); // Fetch quotes from the controller

    // Create fill-in-the-blank questions
    const fillInTheBlankQuestions = quotes.map(({ quote }) => createFillInTheBlank(quote)).slice(0, 5); // Take first 5

    // Create multiple-choice questions
    const multipleChoiceQuestions = quotes.map(({ quote, movie }) => 
        createMultipleChoiceQuestion(quote, movie, quotes.map(q => q.movie))
    ).slice(0, 5); // Take first 5

    // Return data in the format required for quizData
    return {
        [genre]: [
            ...fillInTheBlankQuestions,
            ...multipleChoiceQuestions.map(mc => ({
                type: "multiple-choice",
                question: mc.question,
                options: mc.options,
                correct: mc.options.indexOf(mc.answer), // Index of the correct answer
            })),
        ],
    };
};


module.exports = {
    getGameData,
};
