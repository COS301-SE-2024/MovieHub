import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from "react-native";
import { getWatchlistDetails } from "../Services/ListApiService"; // Make sure to adjust the import path
import { useTheme } from "../styles/ThemeContext";

const WatchlistDetails = ({ route }) => {
    const [iniWatchlist, setWatchlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();
    const { watchlist } = route.params;
    console.log("Here is the watchlist passed: ", JSON.stringify(watchlist));

    useEffect(() => {
        const fetchWatchlistDetails = async () => {
            try {
                console.log("===========");
                const watchlistId = watchlist.id;
                console.log(watchlistId);
                const data = await getWatchlistDetails(watchlistId);
                console.log("Watchlist Id in WatchListDetails", JSON.stringify(watchlistId));

                setWatchlist(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlistDetails();
    }, [watchlist]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={theme.primaryColor} />
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
                {iniWatchlist.movieList &&
                    iniWatchlist.movieList.map((movie) => (
                        <View key={movie.id} style={styles.movieItem}>
                            <View style={styles.imagePlaceholder}>
                                <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }} style={styles.movieImage} />
                            </View>
                            <View style={styles.movieDetails}>
                                <Text style={styles.movieTitle}>{movie.title}</Text>
                                <Text style={styles.movieGenre}>{movie.genre}</Text>
                                <Text style={styles.movieDuration}>{movie.duration + " min"}</Text>
                            </View>
                        </View>
                    ))}
            </ScrollView>
        </View>
    );
};

export default WatchlistDetails;
