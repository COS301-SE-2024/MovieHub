import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

const WatchlistDetails = ({ route }) => {
    const watchlist = {
        name: "Hey",
        moviesList: [
            {
                id: '1',
                title: 'Inception',
                genre: 'Action, Sci-Fi',
                duration: '148 min',
                poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            },
            {
                id: '2',
                title: 'The Dark Knight',
                genre: 'Action, Crime, Drama',
                duration: '152 min',
                poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            },
            {
                id: '3',
                title: 'Interstellar',
                genre: 'Adventure, Drama, Sci-Fi',
                duration: '169 min',
                poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            },
            {
                id: '4',
                title: 'Inside Out',
                genre: 'Animation, Adventure, Comedy',
                duration: '95 min',
                poster_path: '/nQK2B3cNspR6NAHZ4VAsWKHokJv.jpg',
            },
            {
                id: '5',
                title: 'IT',
                genre: 'Horror',
                duration: '135 min',
                poster_path: '/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg',
            },
            {
                id: '6',
                title: 'Bad Boys',
                genre: 'Action, Comedy, Crime',
                duration: '119 min',
                poster_path: '/x1ygBecKHfXX4M2kRhmFKWfWbJc.jpg',
            },
            
        ]
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{watchlist.name}</Text>
            <ScrollView>
                {watchlist.moviesList && watchlist.moviesList.map((movie) => (
                    <View key={movie.id} style={styles.movieItem}>
                        <View style={styles.imagePlaceholder}>
                            <Image 
                                source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }} 
                                style={styles.movieImage} 
                            />
                        </View>
                        <View style={styles.movieDetails}>
                            <Text style={styles.movieTitle}>{movie.title}</Text>
                            <Text style={styles.movieGenre}>{movie.genre}</Text>
                            <Text style={styles.movieDuration}>{movie.duration}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf:'center'
    },
    movieItem: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: 110,
        height: 150,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    movieImage: {
        width: '100%',
        height: '100%',
    },
    movieDetails: {
        flex: 1,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    movieGenre: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    movieDuration: {
        fontSize: 14,
        color: '#888',
    },
});

export default WatchlistDetails;
