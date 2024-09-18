import React, { useState } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Switch, FlatList, Image, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";

import { editReview } from "../Services/PostsApiServices";

export default function EditReview({ route }) {
    const { username, uid, titleParam, thoughtsParam, imageUriParam, reviewId, ratingParam, movieName } = route.params;
    const userInfo = { username, userId: uid };
    const [isMovieReview, setIsMovieReview] = useState(true);
    const [title, setTitle] = useState(titleParam);
    const [thoughts, setThoughts] = useState(thoughtsParam);
    const [movieSearch, setMovieSearch] = useState(movieName);
    const [allowComments, setAllowComments] = useState(true);
    const [imageUri, setImageUri] = useState(imageUriParam);
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(ratingParam); // Add state for rating
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    const isReviewButtonDisabled = title.trim() === "" || thoughts.trim() === "";
    const navigation = useNavigation();

    // Mock movie search results
    const movieResults = movieSearch
        ? [
              { id: "1", title: "Inception" },
              { id: "2", title: "The Matrix" },
              { id: "3", title: "Interstellar" },
          ]
        : [];

    const handleAddImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
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

    const handleRemoveImage = () => {
        setImageUri(null);
    };

    const handleAddLink = () => {
        Alert.alert("Add Link", "This functionality is not implemented yet.");
    };

    const handleAddEmoji = () => {
        Alert.alert("Add Emoji", "This functionality is not implemented yet.");
    };

    const handleEditReview = async () => {
        const reviewData = {
            reviewId: reviewId,
            reviewTitle: title,
            text: thoughts,
            uid: uid, //LEAVE THIS AS 0 FOR THE USER. DO NOT CHANGE TO THE USERID. THIS WILL WORK THE OTHER ONE NOT.
            img: imageUri,
            isReview: isMovieReview,
            rating: isMovieReview ? rating : 0,
        };

        try {
            const review = await editReview(reviewData);
            Alert.alert(
                "Success",
                "Review edited successfully",
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
            Alert.alert("Error", "Error editing review", [{ text: "OK" }], { cancelable: false });
            console.error("Error editing review:", error);
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

    return (
        <ScrollView style={styles.container}>
            {imageUri && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                        <Icon name="close-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.replaceImageButton} onPress={handleReplaceImage}>
                        <CommIcon name="image-edit" size={24} color="#fff" />
                    </TouchableOpacity> */}
                </View>
            )}

            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} selectionColor="#000" />

            <View>
                <Text style={styles.label}>Movie</Text>
                <TextInput style={styles.input} placeholder="Search for a movie" value={movieSearch} onChangeText={setMovieSearch} selectionColor="#000" />
                {movieResults.length > 0 && 
                    <FlatList 
                        data={movieResults} 
                        keyExtractor={(item) => item.id} 
                        renderItem={({ item }) => 
                            <Text style={styles.movieResult}>{item.title}</Text>
                        } 
                    />
                }
                <Text style={styles.label}>Rating</Text>
                <View style={styles.ratingContainer}>{renderRatingOptions()}</View>
            </View>

            <Text style={styles.label}>Thoughts</Text>
            <TextInput style={[styles.input, styles.textArea]} value={thoughts} onChangeText={setThoughts} multiline selectionColor="#000" />

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
                    <Switch 
                        value={allowComments} 
                        onValueChange={setAllowComments} 
                        trackColor={{ false: "#767577", true: "#827DC3" }} 
                        thumbColor={allowComments ? "#4A42C0" : "#fff"} 
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.saveDrafts}>Save to drafts</Text>
                <TouchableOpacity style={[styles.reviewButton, isReviewButtonDisabled && styles.reviewButtonDisabled]} disabled={isReviewButtonDisabled} onPress={handleEditReview}>
                    <Text style={styles.reviewButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            {feedbackVisible && (
                <View style={[styles.feedbackContainer, feedbackSuccess ? styles.success : styles.error]}>
                    <Text style={styles.feedback}>{feedbackMessage}</Text>
                </View>
            )}
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
        fontSize: 16,
        fontWeight: "600",
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
    reviewButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 35,
        borderRadius: 10,
        opacity: 1,
    },
    reviewButtonDisabled: {
        opacity: 0.7,
    },
    reviewButtonText: {
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
    feedbackContainer: {
        flexShrink: 1,
        flexWrap: "wrap",
        alignSelf: "center",
        display: "flex",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
    },
    feedback: {
        color: "#fff",
    },
    success: {
        backgroundColor: "#31B978",
    },
    error: {
        backgroundColor: "#FF4C4C",
    },
});
