import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Post from "./Post";
import { getUserLikedPosts } from "../Services/UsersApiService";

export default function LikesTab() {
    const [likedPosts, setLikedPosts] = useState([]);
    const userId = 0;

    useEffect(() => {
        const fetchLikedPosts = async () => {
            try {
                const posts = await getUserLikedPosts(userId);
                setLikedPosts(posts);
            } catch (error) {
                console.error("Error fetching liked posts:", error);
            }
        };

        fetchLikedPosts();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                {likedPosts.length === 0 ? (
                    <View style={styles.noPostsContainer}>
                        <Text style={styles.title}>You haven't liked any reviews yet.</Text>
                        <Text style={styles.subtitle}>Start exploring and find reviews that resonate with you!</Text>
                    </View>
                ) : (
                    likedPosts.map((post) => (
                        <Post
                            key={post.id}
                            username={post.username}
                            userHandle={post.userHandle}
                            userAvatar={post.userAvatar}
                            likes={post.likes}
                            comments={post.comments}
                            saves={post.saves}
                            postTitle={post.postTitle}
                            preview={post.preview}
                            datePosted={post.datePosted}
                            image={post.image}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
    },
    noPostsContainer: {
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
