import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from "react-native";
import { createWatchlist } from '../Services/ListApiService';
import { getPopularMovies } from '../Services/TMDBApiService'; // Adjust the import path as necessary

export default function AddMovies({ route, navigation }) {
    // Receive watchlist data passed from CreateWatchlist
    const { watchlistData } = route.params;

    // State to hold popular movies from TMDB
    const [movies, setMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const moviesData = await getPopularMovies();
                setMovies(moviesData);
            } catch (error) {
                console.error('Error fetching popular movies:', error);
            }
        };
        fetchMovies();
    }, []);

    const toggleMovieSelection = (movie) => {
        setSelectedMovies((prevSelected) =>
            prevSelected.some(selectedMovie => selectedMovie.id === movie.id)
                ? prevSelected.filter((selectedMovie) => selectedMovie.id !== movie.id)
                : [...prevSelected, movie]
        );
    };

    const handleDone = async () => {
        console.log("In handle Done");
        // Collect selected movie names
        const selectedMovieNames = selectedMovies.map((movie) => movie.title);

        // Add selected movie names to watchlist data
        const finalWatchlistData = {
            ...watchlistData,
            movies: selectedMovieNames,
        };
        console.log('Watchlist info: '+ finalWatchlistData);
        try {
            const userId = 'pTjrHHYS2qWczf4mKExik40KgLH3';
            // Call createWatchlist function to create the watchlist
            await createWatchlist(userId, finalWatchlistData);
            Alert.alert('Success', 'Watchlist created successfully!');
            navigation.navigate('ProfilePage');
        } catch (error) {
            Alert.alert('Error', 'Failed to create watchlist.');
            console.error(error);
        }
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity
            style={styles.movieItem}
            onPress={() => toggleMovieSelection(item)}
        >
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                style={styles.movieImage}
            />
            {selectedMovies.some(selectedMovie => selectedMovie.id === item.id) && <View style={styles.tick} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Movies to Watchlist</Text>
                <TouchableOpacity style={styles.nextButton} onPress={handleDone}>
                    <Text style={styles.nextButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={movies}
                renderItem={renderMovieItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.grid}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    nextButton: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
    },
    nextButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    grid: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    movieItem: {
        width: "45%",
        height: 275,
        margin: "1.5%",
        backgroundColor: "#e1e1e1",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderRadius: 10,
    },
    movieImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    movieTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    tick: {
        width: 30,
        height: 30,
        backgroundColor: "black",
        borderRadius: 15,
        position: "absolute",
        top: 10,
        right: 10,
    },
});
