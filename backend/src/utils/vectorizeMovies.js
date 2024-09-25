const natural = require('natural');
const TfIdf = natural.TfIdf;

function vectorizeMovies(combinedFeatures) {
    const tfidf = new TfIdf();
    const termSet = new Set();

    // First pass: Add each movie's combined features to the TfIdf instance and collect all terms
    combinedFeatures.forEach(features => {
        tfidf.addDocument(features);

        // Collect all unique terms across all movies
        features.split(' ').forEach(term => {
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

        return vector;
    });

    return movieVectors;
}

module.exports = vectorizeMovies;
