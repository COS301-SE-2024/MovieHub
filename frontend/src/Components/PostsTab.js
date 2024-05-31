import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import Post from "./Post";

export default function PostsTab() {
    const username = "Lily Smith";
    const userHandle = "@a_lily";
    const posts = [
        
    ];

    return (
        <View>
            {posts.length === 0 ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Share your thoughts!</Text>
                    <Text style={styles.subtitle}>Create your first post</Text>
                </View>
            ) : (
                posts.map((post) => <Post username={username} userHandle={userHandle} key={post.postTitle} {...post} />)
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 35,
        paddingTop: 35,  
        textAlign: "center",   
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        color: "#2196f3",
        fontWeight: "600",
    },
});
