import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image,RefreshControl,FlatList,StatusBar,Dimensions,SafeAreaView,ActivityIndicator } from 'react-native';
import BottomHeader from '../Components/BottomHeader';
import MovieCard from '../Components/MovieCard';
import { useRoute } from '@react-navigation/native';
import TrendingMovie from "../Components/TrendingMovies";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";


const GenrePage = () => {
    const route = useRoute();
    const { genreName, genreData } = route.params;

    if (!genreData || typeof genreData !== 'object') {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#4A42C0" style={styles.activityIndicator} />
            </SafeAreaView>
        );
    }

    const [colors, setColors] = useState([
        "rgba(0, 0, 0, 0.7)", // Fallback to white if colors not loaded
        "rgba(0, 0, 0, 0.7)",
        "rgba(0, 0, 0, 0.7)",
    ]);
    

    const [randomMovie, setRandomMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const { top10 = [], mostWatched = [], newMovies = [], topPicks = [] } = genreData;

    const getRandomMovie = (movies) => {
        if (movies.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * movies.length);
        return movies[randomIndex];
    };


    useEffect(() => {
        const fetchColors = async (imageUrl) => {
            try {
                const response = await axios.post('http://localhost:3000/extract-colors', { imageUrl }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Convert RGB arrays to rgba strings
                const convertedColors = response.data.colors.slice(0, 3).map((color) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);

                setColors(convertedColors);
            } catch (error) {
                console.error('Error fetching colors:', error);
            }
            finally {
                setLoading(false); 
            }
        };

        if (top10.length > 0) {
            const movie = top10[0];
            const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            fetchColors(imageUrl);
        }
    }, [top10]);


    if (loading || !genreData || typeof genreData !== 'object') {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#4A42C0" style={styles.activityIndicator} />
            </SafeAreaView>
        );
    }


    const renderMovies = (movies) => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
            {movies.slice(0, 15).map((movie, index) => (
                <TrendingMovie
                    key={index}
                    movieId={movie.id}
                    imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    overview={movie.overview}
                    rating={movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    date={new Date(movie.release_date).getFullYear()}
                />
            ))}
        </ScrollView>
    );

    const renderPop = (movies) => (
        <View horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
            {movies.slice(0, 1).map((movie, index) => (

            <MovieCard
                key={index}
                movieId={movie.id}
                imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                title={movie.title}
                overview={movie.overview}
                rating={movie.vote_average.toFixed(1)}
                date={new Date(movie.release_date).getFullYear()}
            />
            ))}
        </View>
    );

    return (
    <View style={styles.container}>
         <StatusBar translucent backgroundColor="transparent" />
        <LinearGradient
                colors={colors}
                style={styles.content}>
                    <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "black"]}>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "black"]}>
            <Text style={styles.title}>{genreName}</Text>

                <Text style={styles.subtitle}>Top 10</Text>
                {renderMovies(top10)}
                
                <Text style={styles.subtitle}>Most Watched</Text>
                {renderMovies(mostWatched)}

                <Text style={styles.subtitle}>The Classics</Text>
                {renderMovies(newMovies)}


                <Text style={styles.subtitle}>Today's Top Picks for You</Text>
                {renderMovies(topPicks)}
                </LinearGradient>
            </ScrollView>
            </LinearGradient>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
        
        // backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: -30,
        textAlign: 'left',
        paddingLeft: 10,
        paddingTop: 100,
        color: "white",
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 0,
        textAlign: 'left',
        paddingLeft: 10,
        color: "white",
    },
    scrollView: {
        paddingVertical: 10,
    },
    movieContainer: {
        marginRight: 10,
        // backgroundColor: 'transparent',
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
    activityIndicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default GenrePage;
