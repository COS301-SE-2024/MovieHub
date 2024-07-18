import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Post from "./Post";

import { getUserLikedPosts } from "../Services/UsersApiService";

export default function LikesTab({ userInfo, userProfile, handleCommentPress }) {
    const [likedPosts, setLikedPosts] = useState([]);

    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const formatTimeAgoFromDB = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return `${seconds}s ago`;
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 30) return `${days}d ago`;
        if (months < 12) return `${months}mo ago`;
        return `${years}y ago`;
    };

    const fetchLikedPosts = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserLikedPosts(userId);
            console.log("Fetched likes", response);
            console.log("Fetched likes", response.data[0].properties);

            if (response.data && response.data.length > 0) {
                const formattedPosts = response.data.map(post => ({
                    postId: post.postId, // Assuming elementId is postId
                    username: post.properties.username,
                    userHandle: "@" + post.properties.userHandle,
                    userAvatar: post.properties.avatar,
                    postTitle: post.properties.postTitle,
                    likes: getRandomNumber(0, 100), // Replace with actual likes count if available
                    comments: post.properties.commentsCount || 0, // Replace with actual comments count if available
                    image: post.properties.image || null,
                    preview: post.properties.text,
                    datePosted: formatTimeAgoFromDB(post.properties.createdAt),
                }));
                setLikedPosts(formattedPosts);
            } else {
                setLikedPosts([]);
            }
        } catch (error) {
            console.log("Error fetching liked posts:", error);
            setLikedPosts([]);
        }
    };

    useEffect(() => {
        fetchLikedPosts();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {likedPosts.length === 0 ? (
                    <View style={styles.container}>
                        <Text style={styles.title}>You haven't liked any posts or reviews yet.</Text>
                        <Text style={styles.subtitle}>Start exploring and find reviews that resonate with you!</Text>
                    </View>
                ) : (
                    likedPosts.map(post => (
                        <Post
                            key={post.postId} // Assuming postId is unique
                            username={post.username}
                            userHandle={post.userHandle}
                            userAvatar={post.userAvatar}
                            postTitle={post.postTitle}
                            likes={post.likes}
                            comments={post.comments}
                            saves={post.saves}
                            preview={post.preview}
                            image={post.image}
                            datePosted={post.datePosted}
                            handleCommentPress={handleCommentPress}
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
        paddingHorizontal: 35,
        paddingTop: 55,
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
