import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getWatchlistDetails } from '../Services/ListApiService';
import { getMovieDetails } from '../Services/TMDBApiService'; // Assume this function exists
import { useTheme } from "../styles/ThemeContext";
import { colors, themeStyles } from "../styles/theme";
import { useNavigation } from '@react-navigation/native';

const WatchlistDetails = ({ route }) => {
    const { theme } = useTheme();
    const [iniWatchlist, setWatchlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const { watchlist } = route.params;
    console.log('Here is the watchlist passed: ', JSON.stringify(watchlist));
   
    useEffect(() => {
        const fetchWatchlistDetails = async () => {
            try {
                const watchlistId = watchlist.id;
                console.log(watchlistId);
                let data = await getWatchlistDetails(watchlistId);
                console.log('Watchlist Id in WatchListDetails', JSON.stringify(watchlistId));
                // Fetch additional details for each movie
                const updatedMovieList = await Promise.all(data.movieList.map(async (movie) => {
                    if (!movie.vote_average || !movie.overview || !movie.release_date || !movie.genre) {
                        const additionalDetails = await getMovieDetails(movie.id);
                        return { ...movie, ...additionalDetails };
                    }
                    return movie;
                }));

                data = { ...data, movieList: updatedMovieList };
                console.log('Updated watchlist data:', JSON.stringify(data, null, 2));

                setWatchlist(data);
            } catch (error) {
                console.error('Error fetching watchlist details:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlistDetails();
    }, [watchlist]);

    const handleMoviePress = (movie) => {
        console.log('Movie pressed:', JSON.stringify(movie, null, 2));
        navigation.navigate('MovieDescriptionPage', {
            movieId: movie.id,
            imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : null,
            title: movie.title,
            rating: movie.vote_average,
            overview: movie.overview,
            date: new Date(movie.release_date).getFullYear(),
            genre: Array.isArray(movie.genres) ? movie.genres.map(g => g.name).join(', ') : movie.genre
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }
    if (error) return <Text>Error: {error}</Text>;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 12,
            backgroundColor: theme.backgroundColor,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 16,
            alignSelf: "center",
            color: theme.textColor,
        },
        movieItem: {
            flexDirection: "row",
            marginBottom: 16,
            alignItems: "center",
        },
        imagePlaceholder: {
            width: 110,
            height: 150,
            backgroundColor: "#e0e0e0",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
        },
        movieImage: {
            width: "100%",
            height: "100%",
        },
        movieDetails: {
            flex: 1,
        },
        movieTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
        },
        movieGenre: {
            fontSize: 14,
            color: "#888",
            marginBottom: 4,
        },
        movieDuration: {
            fontSize: 14,
            color: "#888",
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{iniWatchlist.name}</Text>
            <ScrollView>
                {iniWatchlist.movieList && iniWatchlist.movieList.map((movie) => (
                    <TouchableOpacity key={movie.id} onPress={() => handleMoviePress(movie)}>
                        <View style={styles.movieItem}>
                            <View style={styles.imagePlaceholder}>
                                {movie.poster_path && (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
                                        style={styles.movieImage}
                                    />
                                )}
                            </View>
                            <View style={styles.movieDetails}>
                                <Text style={styles.movieTitle}>{movie.title}</Text>
                                <Text style={styles.movieGenre}>
                                    {Array.isArray(movie.genres) 
                                        ? movie.genres.map(g => g.name).join(', ')
                                        : movie.genre || 'Genre not available'}
                                </Text>
                                <Text style={styles.movieRating}>
                                    Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                                </Text>
                                <Text style={styles.movieDate}>
                                    Released: {movie.release_date || 'Date not available'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};


export default WatchlistDetails;
