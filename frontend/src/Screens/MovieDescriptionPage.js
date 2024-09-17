import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity, Modal, Button } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getMovieCredits, getMovieRuntime } from "../Services/TMDBApiService";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Octicons, FontAwesome6, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { getLocalIP } from '../Services/getLocalIP';
import Cast from "../Components/Cast";
import axios from "axios";
import { getRecommendedMovies } from "../Services/RecApiService"; // Import RecApiService

export default function MovieDescriptionPage({ userInfo }) {
    const localIP = getLocalIP();
    const route = useRoute();
    const { movieId, imageUrl, title, rating, overview, date } = route.params;

    const [colors, setColors] = useState(["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0.7)"]); // Initial state with three colors
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [loading, setLoading] = useState(true);
    const [runtime, setRuntime] = useState(null);
    const [recommendedMovies, setRecommendedMovies] = useState([]); // State for recommended movies

    useEffect(() => {
        const fetchCredits = async () => {
            const data = await getMovieCredits(movieId);
            setCredits(data);
        };
        fetchCredits();
    }, [movieId]);

    useEffect(() => {
        const fetchRuntime = async () => {
            try {
                const minutes = await getMovieRuntime(movieId);
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                setRuntime({ hours, mins });
            } catch (error) {
                console.error('Error fetching runtime:', error);
            }
        };
        fetchRuntime();
    }, [movieId]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await axios.post(
                    `http://${localIP}:3000/extract-colors`,
                    { imageUrl },
                    { headers: { "Content-Type": "application/json" } }
                );
                const convertedColors = response.data.colors.slice(0, 3).map(color => `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);
                setColors(convertedColors);
            } catch (error) {
                console.error("Error fetching colors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchColors();
    }, [imageUrl]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const recommendations = await getRecommendedMovies(movieId); // Fetch recommended movies
                setRecommendedMovies(recommendations); // Set the state
            } catch (error) {
                console.error("Error fetching recommended movies:", error);
            }
        };
        fetchRecommendations();
    }, [movieId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#4A42C0" style={styles.activityIndicator} />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <LinearGradient colors={colors} style={styles.content}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Other movie details and components */}

                    {/* Recommended Movies Section */}
                    <View style={styles.recommendationSection}>
                        <Text style={styles.sectionTitle}>Recommended Movies</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendationList}>
                            {recommendedMovies.map((movie, index) => (
                                <TouchableOpacity key={index} style={styles.movieCard} onPress={() => navigation.navigate('MovieDescriptionPage', { movieId: movie.id, imageUrl: movie.imageUrl, title: movie.title, rating: movie.rating, overview: movie.overview, date: movie.releaseDate })}>
                                    <Image source={{ uri: movie.imageUrl }} style={styles.moviePoster} />
                                    <Text style={styles.movieTitle}>{movie.title}</Text>
                                    <Text style={styles.similarityScore}>Similarity: {movie.similarityScore}%</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Rest of your MovieDescriptionPage code */}
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    // Add your existing styles here

    recommendationSection: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    recommendationList: {
        flexDirection: 'row',
    },
    movieCard: {
        marginRight: 10,
        width: 120,
    },
    moviePoster: {
        width: 120,
        height: 180,
        borderRadius: 8,
    },
    movieTitle: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    similarityScore: {
        fontSize: 12,
        color: '#AAA',
    },
});
