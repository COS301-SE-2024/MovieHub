import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Switch, FlatList, Image, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import { addPost, addReview } from "../Services/PostsApiServices";
import { colors } from "../styles/theme";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { searchMovies } from "../Services/TMDBApiService";

export default function CreatePost({ route }) {
    const { theme } = useTheme();
    const { userInfo } = route.params;
    const [isMovieReview, setIsMovieReview] = useState(false);
    const [title, setTitle] = useState("");
    const [movieId, setMovieId] = useState("");
    const [thoughts, setThoughts] = useState("");
    const [movieSearch, setMovieSearch] = useState("");
    const [movieResults, setMovieResults] = useState([]);
    const [allowComments, setAllowComments] = useState(true);
    const [imageUri, setImageUri] = useState(null);
    const [rating, setRating] = useState(0); // Add state for rating
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [isTooltipVisible, setTooltipVisibility] = useState(false);
    const isPostButtonDisabled = title.trim() === "" || thoughts.trim() === "";
    const navigation = useNavigation();

    useEffect(() => {
        if (movieSearch.length > 1) {
            const fetchMovies = async () => {
                try {
                    const results = await searchMovies(movieSearch);
                    setMovieResults(results.slice(0, 10)); // Get only the first 4 results
                } catch (error) {
                    console.error("Error fetching movies:", error);
                }
            };
            fetchMovies();
        } else {
            setMovieResults([]);
        }
    }, [movieSearch]);

    const handleAddImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            includeBase64: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleReplaceImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        } else {
        }
    };

    const toggleTooltip = () => {
        setTooltipVisibility(!isTooltipVisible);
    };

    const handleRemoveImage = () => {
        setImageUri(null);
    };

    const handleAddLink = () => {
        Alert.prompt(
            "Add Link",
            "Please enter a URL:",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: (url) => {
                        if (url && isValidUrl(url)) {
                            setLinkUrl(url);
                        } else {
                            Alert.alert("Invalid URL", "Please enter a valid URL");
                        }
                    },
                },
            ],
            "plain-text"
        );
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleAddEmoji = () => {
        Alert.alert("Add Emoji", "This functionality is not implemented yet.");
    };

    const handleAddPost = async () => {
        const postData = {
            postTitle: title,
            text: thoughts,
            uid: userInfo.userId, //LEAVE THIS AS 0 FOR THE USER. DO NOT CHANGE TO THE USERID. THIS WILL WORK THE OTHER ONE NOT.
            img: imageUri,
            link: linkUrl,
            isReview: isMovieReview,
            rating: isMovieReview ? rating : 0,
        };

        try {
            const post = await addPost(postData);
            // Alert user that the post was added successfully
            Alert.alert(
                "Success",
                "Post added successfully",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            // clear all inputs
                            setTitle("");
                            setThoughts("");
                            setRating(0);
                            setMovieSearch("");

                            navigation.navigate("Home", { userInfo });
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            Alert.alert("Error", "Error adding post", [{ text: "OK" }], { cancelable: false });
            console.error("Error adding post:", error);
        }
    };

    const handleAddReview = async () => {
        const reviewData = {
            uid: userInfo.userId, //LEAVE THIS AS 0 FOR THE USER. DO NOT CHANGE TO THE USERID. THIS WILL WORK THE OTHER ONE NOT.
            movieId: movieId,
            reviewTitle: title,
            text: thoughts,
            img: imageUri,
            isReview: isMovieReview,
            rating: isMovieReview ? rating : 0,
            movieTitle: movieSearch,
        };

        try {
            const review = await addReview(reviewData);
            // Alert user that the review was added successfully
            Alert.alert(
                "Success",
                "Review added successfully",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            // clear all inputs
                            setTitle("");
                            setThoughts("");
                            setRating(0);
                            setMovieSearch("");

                            navigation.navigate("Home", { userInfo });
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            Alert.alert("Error", "Error adding review", [{ text: "OK" }], { cancelable: false });
            console.error("Error adding review:", error);
        }
    };

    const handleRatingPress = (value) => {
        setRating(value);
    };

    const renderRatingOptions = () => {
        const ratingOptions = [];
        for (let i = 1; i <= 10; i++) {
            ratingOptions.push(
                <TouchableOpacity key={i} onPress={() => handleRatingPress(i)} style={[styles.ratingOption, rating === i && styles.ratingOptionSelected]}>
                    <Text style={styles.ratingText}>{i}</Text>
                </TouchableOpacity>
            );
        }
        return ratingOptions;
    };

    const handleMovieSelect = (movie) => {
        setMovieResults([]);
        setMovieSearch(movie.title);
        setMovieId(movie.id);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: theme.backgroundColor,
            paddingHorizontal: 25,
        },
        toggleContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
        },
        label: {
            fontSize: 14,
            fontWeight: "800",
            paddingBottom: 10,
            color: theme.textColor,
        },
        input: {
            height: 45,
            borderRadius: 10,
            backgroundColor: theme.inputBackground,
            paddingHorizontal: 10,
            marginBottom: 20,
        },
        textArea: {
            height: 100,
            textAlignVertical: "top",
            paddingTop: 8,
        },
        movieResult: {
            padding: 10,
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        actionsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        },
        iconsContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "30%",
        },
        allowCommentsContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        allowComments: {
            marginTop: 4,
        },
        footer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 45,
        },
        saveDrafts: {
            color: "#0f5bd1",
            fontWeight: "600",
        },
        postButton: {
            backgroundColor: theme.primaryColor,
            borderRadius: 10,
            opacity: 1,
            width: "100%",
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
        },
        postButtonDisabled: {
            opacity: 0.7,
        },
        postButtonText: {
            color: "white",
            fontWeight: "bold",
        },
        imagePreviewContainer: {
            position: "relative",
            marginBottom: 20,
        },
        imagePreview: {
            width: "100%",
            height: 400,
            borderRadius: 10,
            marginBottom: 10,
            objectFit: "contain",
        },
        removeImageButton: {
            position: "absolute",
            top: 10,
            right: 25,
            backgroundColor: colors.primary,

            borderRadius: 50,
        },
        replaceImageButton: {
            position: "absolute",
            top: 10,
            right: 60,
            backgroundColor: colors.primary,
            borderRadius: 50,
        },
        ratingContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
        },
        ratingOption: {
            padding: 8,
            borderWidth: 1,
            borderColor: theme.borderColor,
            borderRadius: 5,
        },
        ratingOptionSelected: {
            backgroundColor: "#827DC3",
            borderColor: theme.primaryColor,
        },
        ratingText: {
            fontSize: 16,
            color: theme.textColor,
        },
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            width: 300,
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
        },
        modalSuccess: {
            backgroundColor: "rgb(72, 209, 204)",
        },
        modalError: {
            backgroundColor: "green",
        },
        modalText: {
            color: theme.textColor,
            fontSize: 16,
            textAlign: "center",
        },
        modalButton: {
            backgroundColor: theme.primaryColor,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 4,
        },
        modalButtonText: {
            color: theme.textColor,
            fontWeight: "bold",
        },
        movieResultsScrollView: {
            position: "absolute",
            maxHeight: 240,
            marginBottom: 16,
            backgroundColor: theme.backgroundColor,
            width: "100%",
            zIndex: 1,
            top: 90,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: {
                width: 10,
                height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 1,
            borderColor: theme.borderColor,
            borderWidth: 0.4,
        },
        movieResult: {
            padding: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        movieResultText: {
            fontSize: 16,
            color: theme.textColor,
        },
        movieResultImage: {
            width: 50,
            height: 75,
            marginRight: 8,
        },
        infoIcon: {
            marginLeft: 5,
        },
        tooltip: {
            backgroundColor: "#f9c74f",
            padding: 10,
            borderRadius: 5,
            marginVerticalBottom: 5,
            marginBottom: 15,
        },
        tooltipText: {
            color: "#000",
            fontSize: 12,
        },
        bold: {
            fontWeight: "bold",
        }
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.toggleContainer}>
                <View style={{ flexDirection: "row", }}>
                    <Text style={styles.label}>Is this a movie review?</Text>
                    <TouchableOpacity onPress={toggleTooltip} style={styles.infoIcon}>
                        <Octicons name="question" size={15} color={theme.iconColor} />
                    </TouchableOpacity>
                </View>
                <Switch value={isMovieReview} onValueChange={setIsMovieReview} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={isMovieReview ? "#4A42C0" : "#fff"} />
            </View>
            {isTooltipVisible && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}><Text style={styles.bold}>Post:</Text> A short update where users share thoughts, ideas, or comments. </Text>
                    <Text style={styles.tooltipText}><Text style={styles.bold}>Movie Review:</Text> A detailed critique or opinion about a movie. Reviews include ratings, in-depth analysis, and personal views on specific movies.</Text>
                </View>
            )}

            {imageUri && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                        <Icon name="close-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} selectionColor={theme.textColor} color={theme.textColor} />

                {isMovieReview && (
                    <View style={styles.movieSearchContainer}>
                        <Text style={styles.label}>Movie</Text>
                        <TextInput style={styles.input} placeholder="Search for a movie" value={movieSearch} onChangeText={setMovieSearch} placeholderTextColor={theme.gray} selectionColor={theme.textColor} color={theme.textColor} />
                        {movieResults.length > 0 && (
                            <ScrollView style={styles.movieResultsScrollView} contentContainerStyle={styles.movieResultsContainer}>
                                {movieResults.map((movie) => (
                                    <TouchableOpacity key={movie.id} style={styles.movieResult} onPress={() => handleMovieSelect(movie)}>
                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                            <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }} style={styles.movieResultImage} />
                                            <Text style={styles.movieResultText}>{movie.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                        <Text style={styles.label}>Rating</Text>
                        <View style={styles.ratingContainer}>{renderRatingOptions()}</View>
                    </View>
                )}
            </View>

            <Text style={styles.label}>Thoughts</Text>
            <TextInput style={[styles.input, styles.textArea]} value={thoughts} onChangeText={setThoughts} multiline selectionColor={theme.textColor} color={theme.textColor} />

            <View style={styles.actionsContainer}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={handleAddLink}>
                        <CommIcon style={styles.icon} name="link-variant" size={23} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddImage}>
                        <CommIcon style={styles.icon} name="image-size-select-actual" size={23} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddEmoji}>
                        <CommIcon style={styles.icon} name="emoticon-happy-outline" size={23} />
                    </TouchableOpacity>
                </View>
                <View style={styles.allowCommentsContainer}>
                    <Text style={[styles.label, styles.allowComments]}>Allow comments</Text>
                    <Switch value={allowComments} onValueChange={setAllowComments} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={allowComments ? "#4A42C0" : "#fff"} />
                </View>
            </View>
            {/* </View>s */}

            <View style={styles.footer}>
                <TouchableOpacity style={[styles.postButton, isPostButtonDisabled && styles.postButtonDisabled]} disabled={isPostButtonDisabled} onPress={isMovieReview ? handleAddReview : handleAddPost}>
                    <Text style={styles.postButtonText}>{isMovieReview ? "Review" : "Post"}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={feedbackVisible} transparent animationType="fade" onRequestClose={() => setFeedbackVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, feedbackSuccess ? styles.modalSuccess : styles.modalError]}>
                        <Text style={styles.modalText}>{feedbackMessage}</Text>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
        paddingHorizontal: 25,
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "800",
        paddingBottom: 10,
    },
    input: {
        height: 45,
        borderRadius: 10,
        backgroundColor: "#D9D9D9",
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
        paddingTop: 8,
    },
    movieResult: {
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    iconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "30%",
    },
    allowCommentsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    allowComments: {
        marginTop: 4,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 45,
    },
    saveDrafts: {
        color: "#0f5bd1",
        fontWeight: "600",
    },
    postButton: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        opacity: 1,
        width: "100%",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    postButtonDisabled: {
        opacity: 0.7,
    },
    postButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    imagePreviewContainer: {
        position: "relative",
        marginBottom: 20,
    },
    imagePreview: {
        width: "100%",
        height: 400,
        borderRadius: 10,
        marginBottom: 10,
        objectFit: "contain",
    },
    removeImageButton: {
        position: "absolute",
        top: 10,
        right: 25,
        backgroundColor: colors.primary,

        borderRadius: 50,
    },
    replaceImageButton: {
        position: "absolute",
        top: 10,
        right: 60,
        backgroundColor: colors.primary,
        borderRadius: 50,
    },
    ratingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    ratingOption: {
        padding: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    ratingOptionSelected: {
        backgroundColor: "#827DC3",
        borderColor: "#4A42C0",
    },
    ratingText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalSuccess: {
        backgroundColor: "rgb(72, 209, 204)",
    },
    modalError: {
        backgroundColor: "green",
    },
    modalText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    modalButton: {
        backgroundColor: "#4A42C0",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    movieResultsScrollView: {
        position: "absolute",
        maxHeight: 240,
        marginBottom: 16,
        backgroundColor: "#fff",
        width: "100%",
        zIndex: 1,
        top: 90,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 10,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
        borderColor: "#ddd",
        borderWidth: 0.4,
    },
    movieResult: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    movieResultText: {
        fontSize: 16,
    },
    movieResultImage: {
        width: 50,
        height: 75,
        marginRight: 8,
    },
    inputContainer: {
        position: "relative",
        zIndex: 1,
    },
    movieSearchContainer: {
        position: "relative",
        zIndex: 2,
    },
    movieResultsScrollView: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        maxHeight: 240,
        backgroundColor: "#fff",
        zIndex: 3,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: "#ddd",
        borderWidth: 0.4,
    },
});
