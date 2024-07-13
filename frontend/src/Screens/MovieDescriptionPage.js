import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, SafeAreaView, StatusBar, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getMovieCredits } from "../Services/TMDBApiService";
import { LinearGradient } from 'expo-linear-gradient';
import Cast from "../Components/Cast";
import axios from "axios";

const MovieDescriptionPage = () => {
    const route = useRoute();
    const { movieId, imageUrl, title, rating, overview, date } = route.params;
    const [colors, setColors] = useState([
        'rgba(255, 255, 255, 1)', // Fallback to white if colors not loaded
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)'
    ]); // Initial state with three colors, can be replaced with initial color values
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [loading, setLoading] = useState(true); // State to track loading

    useEffect(() => {
        const fetchCredits = async () => {
            const data = await getMovieCredits(movieId);
            setCredits(data); 
        };
 
        fetchCredits();
    }, [movieId]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await axios.post(`http://192.168.8.35:3000/extract-colors`, { imageUrl }, {
                    headers: {
                        'Content-Type': "application/json",
                    },
                });                 
                // Convert RGB arrays to rgba strings
                const convertedColors = response.data.colors.slice(0, 3).map(color =>
                    `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
                );
                                
                setColors(convertedColors);
            } catch (error) {
                console.error('Error fetching colors:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching colors
            }
        };

        fetchColors();
    }, [imageUrl]);

    const director = credits.crew.find((person) => person.job === "Director");
    const cast = credits.cast
        .slice(0, 5)
        .map((person) => person.name)
        .join(", ");

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#4A42C0" style={styles.activityIndicator} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={colors}
                // locations={[0, 0.5, 1]}
                style={styles.content}
            >
                <ScrollView>
                    <View style={styles.wholecontainer}>
                        <View style={styles.card}>
                            <Image source={{ uri: imageUrl }} style={styles.image} />
                        </View>
                    </View>
                    <View style={styles.moviedes}>
                        <View style={styles.movieinfo}>
                            <Text style={styles.movietitle}>{title}</Text>
                            <Text style={styles.movieRating}>{rating}/10</Text>
                        </View>
                        <View style={styles.movieinfo2}>
                            <Text style={styles.movietitle2}>{date} </Text>
                            <Text style={styles.movietitle2}> | </Text>
                            <Text style={styles.movietitle2}> 2h </Text>
                        </View>
                        <View style={styles.moviebio}>
                            <Text style={styles.moviebiotext}>{overview}</Text>
                        </View>
                        <View>
                            <Text style={styles.moviebio}>
                                <Text style={styles.bold}>Starring:</Text> {cast}
                            </Text>
                            <Text style={styles.moviebio}>
                                <Text style={styles.bold}>Directed by:</Text> {director ? director.name : "N/A"}
                            </Text>
                        </View>
                        <Text style={styles.moviecast}> Cast</Text>

                        <ScrollView horizontal>
                            {credits.cast.slice(0, 5).map((member, index) => (
                                <Cast
                                    key={index}
                                    imageUrl={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                                    name={member.name}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    content: {
        flex: 1,
        paddingTop: StatusBar.currentHeight + 40, // Adjust 56 if your header height is different
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wholecontainer: {
        alignItems: "center",
        paddingTop: 30,
        paddingBottom: 50,
        
    },
    card: {
        // width: "75%",
        padding: 10,
        height: 430,
        width: "100%",
        
    },
    image: {
        width: "100%",
        height: "115%",
        objectFit: "contain",
    },
    movieinfo: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    movieinfo2: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 10,
    },
    movietitle: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "left",
        color: "white",
        width: "70%"
    },
    movieRating: {
        fontSize: 23,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
        paddingTop: 7,
    },
    movietitle2: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },
    moviebio: {
        paddingTop: 20,
        paddingLeft: 20,
        color: "white",
    },
    moviebiotext: {
        fontSize: 15,
        paddingRight: 10,
        color: "white",
    },
    cast: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: 170,
        height: 250,
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: "#000",
    },
    moviecast: {
        paddingTop: 20,
        fontSize: 25,
        paddingLeft: 15,
        fontWeight: "bold",
        color: "white",
    },
    bold: {
        fontWeight: "bold",
        fontSize: 15,
        color: "white",
    },
});

export default MovieDescriptionPage;
