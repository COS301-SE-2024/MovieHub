import React, { useState } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Switch, FlatList, Image, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import { editPost } from "../Services/PostsApiServices";

export default function EditPost({route}) {
    const { username, uid, titleParam, thoughtsParam, imageUriParam, postId } = route.params;
    const { theme } = useTheme();
    const userInfo = { username, userId: uid };
    const [isMovieReview, setIsMovieReview] = useState(false);
    const [title, setTitle] = useState(titleParam);
    const [thoughts, setThoughts] = useState(thoughtsParam);
    const [movieSearch, setMovieSearch] = useState("");
    const [allowComments, setAllowComments] = useState(true);
    const [imageUri, setImageUri] = useState(imageUriParam);
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0); // Add state for rating
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    const isPostButtonDisabled = title.trim() === "" || thoughts.trim() === "";
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
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
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
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
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

    const handleEditPost = async () => {
        const postData = {
            postId: postId,
            postTitle: title,
            text: thoughts,
            uid: uid, //LEAVE THIS AS 0 FOR THE USER. DO NOT CHANGE TO THE USERID. THIS WILL WORK THE OTHER ONE NOT.
            img: imageUri,
            isReview: isMovieReview,
            rating: isMovieReview ? rating : 0
        };

        try {
            const post = await editPost(postData);
            // console.log('Post edited successfully:', post);
            Alert.alert(
                "Success",
                "Post edited successfully",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            // clear all inputs 
                            setTitle("");
                            setThoughts("");
                            setRating(0);
                            setMovieSearch("");
                            
                            navigation.navigate("ProfilePage", { userInfo });
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            Alert.alert("Error", "Error editing post", [{ text: "OK" }], { cancelable: false });
            console.error("Error editiing post:", error);
        }
    }

    const handleRatingPress = (value) => {
        setRating(value);
    };

    const renderRatingOptions = () => {
        const ratingOptions = [];
        for (let i = 1; i <= 10; i++) {
            ratingOptions.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handleRatingPress(i)}
                    style={[styles.ratingOption, rating === i && styles.ratingOptionSelected]}
                >
                    <Text style={styles.ratingText}>{i}</Text>
                </TouchableOpacity>
            );
        }
        return ratingOptions;
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
            marginBottom: 20,
        },
        label: {
            fontSize: 16,
            fontWeight: "600",
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
            marginTop: 4
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
            paddingVertical: 10,
            paddingHorizontal: 35,
            borderRadius: 10,
            opacity: 1,
        },
        postButtonDisabled: {
            opacity: 0.7
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
            objectFit: "contain"
        },
        removeImageButton: {
            position: "absolute",
            top: 10,
            right: 25,
            backgroundColor: theme.primaryColor,
            borderRadius: 50,
        },
        replaceImageButton: {
            position: "absolute",
            top: 10,
            right: 60,
            backgroundColor: theme.primaryColor,
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
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={theme.gray} selectionColor={theme.textColor} color={theme.textColor} />

            {isMovieReview && (
                <View>
                    <Text style={styles.label}>Movie</Text>
                    <TextInput style={styles.input} placeholder="Search for a movie" placeholderTextColor={theme.gray} value={movieSearch} onChangeText={setMovieSearch} selectionColor={theme.textColor} color={theme.textColor} />
                    {movieResults.length > 0 && <FlatList data={movieResults} keyExtractor={(item) => item.id} renderItem={({ item }) => <Text style={styles.movieResult}>{item.title}</Text>} />}
                    <Text style={styles.label}>Rating</Text>
                    <View style={styles.ratingContainer}>{renderRatingOptions()}</View>
                </View>
            )}

            <Text style={styles.label}>Thoughts</Text>
            <TextInput style={[styles.input, styles.textArea]} value={thoughts} onChangeText={setThoughts} multiline selectionColor={theme.textColor} color={theme.textColor} />

            <View style={styles.actionsContainer}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={handleAddImage}>
                        <CommIcon style={styles.icon} name="image-size-select-actual" size={23} color={theme.iconColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={[styles.postButton, isPostButtonDisabled && styles.postButtonDisabled]} disabled={isPostButtonDisabled} onPress={handleEditPost}>
                    <Text style={styles.postButtonText}>Save</Text>
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