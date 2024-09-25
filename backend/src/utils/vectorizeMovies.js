const natural = require('natural');
const TfIdf = natural.TfIdf;
const { tokenize } = require('natural');

// Enhanced tokenization function to remove stop words and use n-grams
function enhancedTokenize(text, n = 1) {
    const tokenizer = new natural.WordTokenizer();
    const stopWords = natural.stopwords; // Import natural's default stop words
    const tokens = tokenizer.tokenize(text.toLowerCase());

    // Remove stop words and create n-grams
    const filteredTokens = tokens.filter(token => !stopWords.includes(token));
    return n === 1 ? filteredTokens : natural.NGrams.ngrams(filteredTokens, n).map(ngram => ngram.join(' '));
}

function vectorizeMovies(combinedFeatures) {
    const tfidf = new TfIdf();
    const termSet = new Set();

    // First pass: Add each movie's combined features to the TfIdf instance
    combinedFeatures.forEach(features => {
        const tokens = enhancedTokenize(features, 2); // Using bigrams
        tfidf.addDocument(tokens.join(' ')); // Rejoin the tokens to add as a single document

        // Collect all unique terms across all movies
        tokens.forEach(term => {
            termSet.add(term);
        });
    });

    // Create an array of all unique terms (our "vocabulary")
    const vocabulary = Array.from(termSet);

    // Convert each document's features into a vector of tfidf values based on the unified vocabulary
    const movieVectors = combinedFeatures.map((features, index) => {
        const vector = new Array(vocabulary.length).fill(0);

        // Get the terms and their tfidf values for the current movie
        const terms = tfidf.listTerms(index);

        // Populate the vector according to the tfidf value for each term in the vocabulary
        terms.forEach(term => {
            const termIndex = vocabulary.indexOf(term.term); // Find index of term in the vocabulary
            if (termIndex !== -1) {
                vector[termIndex] = term.tfidf; // Assign the tfidf value at the correct index
            }
        });

        // Normalize the vector (optional, depending on your similarity metric)
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (magnitude > 0) {
            for (let i = 0; i < vector.length; i++) {
                vector[i] /= magnitude; // Normalize the vector
            }
        }

        return vector;
    });

    return movieVectors;
}

module.exports = vectorizeMovies;
