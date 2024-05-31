import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Post from "./Post";

export default function LikesTab() {
    
    const posts = [
        
    ];

    return (
        <View>
            {posts.length === 0 ? (
                <View style={styles.container}>
                    <Text style={styles.title}>You haven't liked any reviews yet.</Text>
                    <Text style={styles.subtitle}>Start exploring and find reviews that resonate with you!</Text>
                </View>
            ) : (
                posts.map((post) => <Post username={post.username} userHandle={post.userHandle} key={post.postTitle} {...post} />)
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
        color: "#7b7b7b",
    },
});
