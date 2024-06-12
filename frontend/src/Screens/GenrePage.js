import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import BottomHeader from '../Components/BottomHeader';

const GenrePage = ({ route }) => {
    const { genreName } = route.params;

    // Function to generate a random number between min and max (inclusive)
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Dummy movie data for demonstration
    const dummyMovies = [
        { title: 'Movie 1', imageUrl: `https://source.unsplash.com/300x450/?movie` },
        { title: 'Movie 2', imageUrl: `https://source.unsplash.com/300x450/?movie${getRandomInt(1, 100)}` },
        { title: 'Movie 3', imageUrl: `https://source.unsplash.com/300x450/?movie${getRandomInt(1, 100)}` },
        { title: 'Movie 4', imageUrl: `https://source.unsplash.com/300x450/?movie${getRandomInt(1, 100)}` },
        { title: 'Movie 5', imageUrl: `https://source.unsplash.com/300x450/?movie${getRandomInt(1, 100)}` },
    ];

    const renderMovies = (movies) => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
            {movies.map((movie, index) => (
                <View key={index} style={styles.movieContainer}>
                    <Image source={{ uri: movie.imageUrl }} style={styles.movieImage} />
                </View>
            ))}
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{genreName}</Text>

                <Text style={styles.subtitle}>Top 10</Text>
                {renderMovies(dummyMovies)}

                <Text style={styles.subtitle}>Most Watched</Text>
                {renderMovies(dummyMovies)}

                <Text style={styles.subtitle}>New on movieHub.</Text>
                {renderMovies(dummyMovies)}

                <Text style={styles.subtitle}>Today's Top Picks for You</Text>
                {renderMovies(dummyMovies)}
            </ScrollView>
            <BottomHeader style={styles.bottomHeader} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
    },
    scrollView: {
        paddingVertical: 10,
    },
    movieContainer: {
        marginRight: 10,
        backgroundColor: '#e0e0e0',
        width: 150,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    movieImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default GenrePage;
