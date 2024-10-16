import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getWatchlistDetails } from '../Services/ListApiService';
import { getMovieDetails } from '../Services/TMDBApiService'; // Assume this function exists
import { useTheme } from "../styles/ThemeContext";
import { colors, themeStyles } from "../styles/theme";
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";

const WatchlistDetails = ({ route }) => {
    const { theme } = useTheme();
    const [iniWatchlist, setWatchlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const navigation = useNavigation();
    const { userInfo } = route.params;
    const { watchlist } = route.params;

    const extractWatchlistId = (watchlist) => {
        const possibleKeys = ['watchlistId', 'id', 'watchlist_id'];
    
        for (const key of possibleKeys) {
            if (watchlist[key] !== undefined) {
                return watchlist[key];
            }
        }
    
        throw new Error('No valid watchlist ID found');
    };
   
    useEffect(() => {
        const fetchWatchlistDetails = async () => {
            try {
                const watchlistId = extractWatchlistId(watchlist);
                // console.log(watchlistId);
                let data = await getWatchlistDetails(watchlistId);
                // console.log('Watchlist Id in WatchListDetails', JSON.stringify(watchlistId));
                // Fetch additional details for each movie
                const updatedMovieList = await Promise.all(data.movieList.map(async (movie) => {
                    if (!movie.vote_average || !movie.overview || !movie.release_date || !movie.genre) {
                        const additionalDetails = await getMovieDetails(movie.id);
                        return { ...movie, ...additionalDetails };
                    }
                    return movie;
                }));

                data = { ...data, movieList: updatedMovieList };
                console.log("uppp",updatedMovieList)
                setWatchlistMovies(updatedMovieList);
                // console.log('Updated watchlist data:', JSON.stringify(data, null, 2));
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
            userInfo,
            movieId: movie.id,
            imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : null,
            title: movie.title,
            rating: movie.vote_average,
            overview: movie.overview,
            date: new Date(movie.release_date).getFullYear(),
            genre: Array.isArray(movie.genres) ? movie.genres.map(g => g.name).join(', ') : movie.genre
        });
    };

    const handleAddMovies = async () => {
        navigation.navigate('AddMovies', { 
            userInfo, 
            watchlistId: extractWatchlistId(watchlist),
            addedMovies: watchlistMovies,
            onUpdateWatchlist: handleUpdateWatchlist
        });
    }

    const handleUpdateWatchlist = async (updatedMovies) => {
        try {
            const watchlistId = extractWatchlistId(watchlist);
            await updateWatchlist(watchlistId, { movieList: updatedMovies });
            setWatchlistMovies(updatedMovies);
            setWatchlist({ ...iniWatchlist, movieList: updatedMovies });
        } catch (error) {
            console.error('Error updating watchlist:', error);
            setError(error.message);
        }
    };

    const getMovieYear = (release_date) => {
        if (release_date) {
            return moment(release_date).format("YYYY");
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 12,
            paddingHorizontal: 0,
            backgroundColor: theme.backgroundColor,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingVertical: 10 ,
            // height: 30,
            paddingLeft: 10,
            backgroundColor: theme.inputBackground,
        },
        headerLeft: {
            flexDirection: "row",
            alignItems: "center",
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.textColor,
        },
        createButton: {
            flexDirection: "row",
            // marginBottom: 10,
            paddingHorizontal: 10,
            alignItems: "center",
            color: theme.textColor,
        },
        createButtonText: {
            fontSize: 14,
            color: theme.textColor,
            fontWeight: "bold",
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 16,
            alignSelf: 'center',
            color: theme.textColor,
        },
        movieItem: {
            flexDirection: 'row',
            marginBottom: 16,
            alignItems: 'center',
            paddingHorizontal: 12,
        },
        imagePlaceholder: {
            width: 110,
            height: 150,
            backgroundColor: theme.backgroundColor,
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
            color: theme.textColor,
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
        indicator: {
            backgroundColor: colors.primary,
            borderRadius: 50,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.backgroundColor,
        },
        movieRating: {
            fontSize: 14,
            color: theme.textColor,
            marginBottom: 4,
        },
        movieDate: {
            fontSize: 14,
            color: theme.textColor,
            marginBottom: 4,
        },
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }
    if (error) return <Text>Error: {error}</Text>;

    
    return (
        <View style={styles.container}>
            {/* <View style={styles.header}>
                <TouchableOpacity style={styles.createButton} onPress={handleAddMovies}>
                    <Text style={styles.createButtonText}>Add Movies</Text>
                    <View style={{ flex: 1 }} />
                    <Icon name="add" size={24} color={theme.iconColor} />
                </TouchableOpacity>
            </View> */}
            <ScrollView showsVerticalScrollIndicator={false}>
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
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon name="star" size={20} color={"gold"} style={{marginBottom: 5}} />
                                    <Text style={styles.movieRating}> Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</Text>
                                </View>
                                <Text style={styles.movieDate}>
                                    Released: {getMovieYear(movie.release_date) || 'Date not available'}
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