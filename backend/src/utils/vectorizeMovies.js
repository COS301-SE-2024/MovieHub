// backend/src/utils/vectorizeMovies.js
const natural = require('natural');
const TfIdf = natural.TfIdf;

function vectorizeMovies(combinedFeatures) {
    const tfidf = new TfIdf();

    // Add each movie's combined features to the TfIdf instance
    combinedFeatures.forEach(features => {
        tfidf.addDocument(features);
    });

    // Convert each document's features into a vector of term frequencies
    const movieVectors = combinedFeatures.map((features, index) => {
        const vector = [];
        const terms = tfidf.listTerms(index);

        terms.forEach(term => {
            vector.push(term.tfidf);
        });

        return vector;
    });

    return movieVectors;
}

module.exports = vectorizeMovies;
