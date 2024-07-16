import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image, TextInput } from "react-native";
import { createWatchlist } from '../Services/ListApiService';
import { searchMovies } from '../Services/TMDBApiService'; // Adjust the import path as necessary

export default function AddMovies({ route, navigation }) {

    const { watchlistData, userInfo } = route.params;


    const [movies, setMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setSearching(true);
        try {
            const moviesData = await searchMovies(query);
            setMovies(moviesData);
        } catch (error) {
            console.error('Error searching movies:', error);
        } finally {
            setSearching(false);
        }
    };

    const toggleMovieSelection = (movie) => {
        setSelectedMovies((prevSelected) =>
            prevSelected.some(selectedMovie => selectedMovie.id === movie.id)
                ? prevSelected.filter((selectedMovie) => selectedMovie.id !== movie.id)
                : [...prevSelected, movie]
        );
    };

    const handleDone = async () => {
        const moviesList = selectedMovies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            genre: movie.genre, 
            duration: movie.duration,
        }));

        const finalWatchlistData = {
            ...watchlistData,
            movies: moviesList.map(movie => movie.title), // Old property to maintain backward compatibility
            moviesList, // New property for detailed movie data
        };

        try {
            const userId = userInfo.userId;
            await createWatchlist(userId, finalWatchlistData);
            Alert.alert('Success', 'Watchlist created successfully!');

            navigation.navigate('ProfilePage', { userInfo });

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
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for movies..."
                    value={query}
                    onChangeText={setQuery}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={searching}>
                    <Text style={styles.searchButtonText}>{searching ? 'Searching...' : 'Search'}</Text>
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
    searchContainer: {
        flexDirection: "row",
        padding: 16,
    },
    searchInput: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 8,
        borderRadius: 5,
        marginRight: 8,
    },
    searchButton: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
    },
    searchButtonText: {
        color: "#fff",
        fontSize: 16,
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
