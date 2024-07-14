import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, SafeAreaView, StatusBar, ActivityIndicator,TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getMovieCredits } from "../Services/TMDBApiService";
import { LinearGradient } from 'expo-linear-gradient';
import Cast from "../Components/Cast";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
    const [isAddedToList, setIsAddedToList] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [isReviewed, setIsReviewed] = useState(false);
    const navigation = useNavigation();

    const handleReviewPress = () => {
        setIsReviewed(true);
        navigation.navigate('CreatePost'); // Make sure 'PostsPage' is the correct route name
    };

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
                const response = await axios.post(`http://10.0.0.104:3000/extract-colors`, { imageUrl }, {
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
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
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
                        <View style={styles.icons}>
                        <TouchableOpacity onPress={() => setIsAddedToList(!isAddedToList)} style={styles.block1}>
                        <View style={styles.iconTextContainer}>
                            <FontAwesome6 name={isAddedToList ? 'check' : 'add'} size={24} color="white" style={styles.icon}/>
                            <Text style={styles.text}>{isAddedToList ? 'Added' : 'Add to list'}</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsWatched(!isWatched)} style={styles.block2} >
                        <View style={styles.iconTextContainer}>
                        <FontAwesome name="check-circle" size={24} color={isWatched ? 'green' : 'white'} style={styles.icon}/>
                            <Text style={styles.text}>{isWatched ? 'Watched' : 'Watch'}</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.block3} onPress={handleReviewPress}>
                        <View style={styles.iconTextContainer}> 
                            <Ionicons name="star-outline" size={24} color={isReviewed ? 'gold' : 'white'} style={styles.icon} />
                            <Text style={styles.text}>{isReviewed ? 'Reviewed' : 'Review'}</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.block4} >
                        <View style={styles.iconTextContainer}>
                            <SimpleLineIcons name="screen-desktop" size={24} color='white' style={styles.icon} /> 
                            <Text style={styles.text}>Watch Party</Text>
                        </View>
                        </TouchableOpacity>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        // backgroundColor: "#ffffff",
    },
    content: {
        flex: 1,
        paddingTop: StatusBar.currentHeight + 80, // Adjust 56 if your header height is different
        width: '100%',
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
    iconTextContainer: {
        width: 79, // Adjust this width to fit your needs
        alignItems: 'center',
    },
    icons: {
        flexDirection: 'row',
        paddingTop: 30,
        paddingLeft: 0,
        paddingBottom: 10,
    },
    icon: {
        paddingLeft: 0,
    },
    text: {
        paddingLeft: 0,
        color: 'white',
        fontWeight: "bold",
    },
    block1: {
        alignItems: 'center',
        marginHorizontal: 9,
    },
    block2: {
        alignItems: 'center',
        marginHorizontal: 9,
    },
    block3: {
        alignItems: 'center',
        marginHorizontal: 9,
    },
    block4: {
        alignItems: 'center',
        marginHorizontal: 9,
    },
    card: {
        // width: "75%",
        paddingTop: 20,
        padding: 10,
        height: 430,
        width: "100%",
        
    },
    image: {
        width: "100%",
        height: "115%",
        objectFit: "contain",
        shadowOffset: {
            width: 0,
            height: 3,
            },
    
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 5,
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
