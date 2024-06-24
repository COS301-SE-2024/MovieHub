import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, FlatList, Image, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { addPost } from "../Services/PostsApiServices";
import { colors } from "../styles/theme";

export default function CreatePost() {
    const [isMovieReview, setIsMovieReview] = useState(false);
    const [title, setTitle] = useState("");
    const [thoughts, setThoughts] = useState("");
    const [movieSearch, setMovieSearch] = useState("");
    const [allowComments, setAllowComments] = useState(true);
    const [imageUri, setImageUri] = useState(null);

    const isPostButtonDisabled = title.trim() === "" || thoughts.trim() === "";

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

        if (!result.cancelled) {
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

    const handleAddPost = async () => {
        const postData = {
            text: "heres a new post",
            userId: 0, //LEAVE THIS AS 0 FOR THE USER. DO NOT CHANGE TO THE USERID. THIS WILL WORK THE OTHER ONE NOT.
            movieId: 310,
            isReview: false,
            rating: 3
        };
        
        try {
            const post = await addPost(postData);
            console.log('Post added successfully:', data);
        } catch(error){
            console.error('Error adding post:', error);
        };
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.toggleContainer}>
                <Text style={styles.label}>Is this a movie review?</Text>
                <Switch value={isMovieReview} onValueChange={setIsMovieReview} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={isMovieReview ? "#4A42C0" : "#fff"} />
            </View>

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

            {isMovieReview && (
                <View>
                    <Text style={styles.label}>Movie</Text>
                    <TextInput style={styles.input} placeholder="Search for a movie" value={movieSearch} onChangeText={setMovieSearch} selectionColor="#000" />
                    {movieResults.length > 0 && <FlatList data={movieResults} keyExtractor={(item) => item.id} renderItem={({ item }) => <Text style={styles.movieResult}>{item.title}</Text>} />}
                </View>
            )}

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
                    <Switch value={allowComments} onValueChange={setAllowComments} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={allowComments ? "#4A42C0" : "#fff"} />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.saveDrafts}>Save to drafts</Text>
                <TouchableOpacity style={[styles.postButton, isPostButtonDisabled && styles.postButtonDisabled]} disabled={isPostButtonDisabled} onPress={handleAddPost}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 35,
        borderRadius: 10,
    },
    postButtonDisabled: {
        backgroundColor: "#aaa",
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
});
