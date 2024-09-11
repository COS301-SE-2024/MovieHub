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

        // Create a vector where each term's tfidf value is stored
        terms.forEach(term => {
            vector.push(term.tfidf);
        });

        // Ensure the vector is consistent in length for all movies
        const maxLength = Math.max(...combinedFeatures.map(f => f.split(' ').length));
        while (vector.length < maxLength) {
            vector.push(0); // Fill with zeros if the vector is shorter
        }

        return vector;
    });

    return movieVectors;
}

module.exports = vectorizeMovies;
