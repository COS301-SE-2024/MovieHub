const natural = require('natural');
const TfIdf = natural.TfIdf;

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
        if (features.trim().length > 0) { // Check for non-empty features
            const tokens = enhancedTokenize(features, 1); // Use unigrams
            tfidf.addDocument(tokens.join(' ')); // Rejoin tokens for TfIdf
            tokens.forEach(term => {
                termSet.add(term);
            });
        }
    });

    const vocabulary = Array.from(termSet);
    const movieVectors = combinedFeatures.map((features, index) => {
        const vector = new Array(vocabulary.length).fill(0);
        const terms = tfidf.listTerms(index);

        // Populate the vector according to the tfidf value for each term in the vocabulary
        terms.forEach(term => {
            const termIndex = vocabulary.indexOf(term.term);
            if (termIndex !== -1) {
                vector[termIndex] = term.tfidf;
            }
        });

        // Normalize the vector (only if not all zero)
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (magnitude > 0) {
            for (let i = 0; i < vector.length; i++) {
                vector[i] /= magnitude; // Normalize the vector
            }
        } else {
            console.warn(`Vector for movie ${index} is all zeros.`);
        }

        console.log(`Vector for movie ${index}: `, vector); // Log each movie's vector for debugging
        return vector;
    });

    return movieVectors;
}

module.exports = vectorizeMovies;
