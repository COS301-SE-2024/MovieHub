import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function CreatePost() {
    const [isMovieReview, setIsMovieReview] = useState(false);
    const [title, setTitle] = useState("");
    const [thoughts, setThoughts] = useState("");
    const [movieSearch, setMovieSearch] = useState("");
    const [allowComments, setAllowComments] = useState(true);

    const isPostButtonDisabled = title.trim() === "" || thoughts.trim() === "";

    // Mock movie search results
    const movieResults = movieSearch
        ? [
              { id: "1", title: "Inception" },
              { id: "2", title: "The Matrix" },
              { id: "3", title: "Interstellar" },
          ]
        : [];

    return (
        <View style={styles.container}>
            <View style={styles.toggleContainer}>
                <Text style={styles.label}>Is this a movie review?</Text>
                <Switch value={isMovieReview} onValueChange={setIsMovieReview} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={isMovieReview ? "#4A42C0" : "#fff"} />
            </View>

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
                    <CommIcon style={styles.icon} name="link-variant" size={23} />
                    <CommIcon style={styles.icon} name="image-size-select-actual" size={23} />
                    <CommIcon style={styles.icon} name="emoticon-happy-outline" size={23} />
                </View>
                <View style={styles.allowCommentsContainer}>
                    <Text style={[styles.label, styles.allowComments]}>Allow comments</Text>
                    <Switch value={allowComments} onValueChange={setAllowComments} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={allowComments ? "#4A42C0" : "#fff"} />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.saveDrafts}>Save to drafts</Text>
                <TouchableOpacity style={[styles.postButton, isPostButtonDisabled && styles.postButtonDisabled]} disabled={isPostButtonDisabled}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    },
    saveDrafts: {
        color: "#0f5bd1",
        fontWeight: "600",
    },
    postButton: {
        backgroundColor: "#4A42C0",
        paddingVertical: 10,
        paddingHorizontal: 35,
        borderRadius: 10,
    },
    postButtonDisabled: {
        backgroundColor: "#9A97BF",
    },
    postButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
