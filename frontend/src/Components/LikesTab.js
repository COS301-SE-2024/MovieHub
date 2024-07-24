import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Post from "./Post";

import { getUserLikedPosts, getLikesOfPost } from "../Services/LikesApiService";
import { getCountCommentsOfPost } from "../Services/PostsApiServices";
import Review from "../Screens/Review";

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
            // console.log("Fetched likes", response);

            if (response.data === null) {
                setLikedPosts([]);
            } else {
                const postsWithComments = await Promise.all(
                    response.data.map(async (post) => {
                        console.log("post", post);
                        const commentsResponse = await getCountCommentsOfPost(post.properties.postId);
                        const likesResponse = await getLikesOfPost(post.properties.postId);
                        const likesCount = likesResponse.data;
                        const commentsCount = commentsResponse.data.postCommentCount;
                        const userHandle = "@" + post.properties.username;
                        return { ...post, commentsCount, likesCount, userHandle };
                    })
                );

                // Sort posts by createdAt in descending order (most recent first)
                postsWithComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setLikedPosts(postsWithComments);
            }
        } catch (error) {
            console.log("Error fetching liked posts:", error);
            setLikedPosts([]);
        } finally {
            setLoading(false); // Set loading to false after fetch completes
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
                        <Text style={styles.title}>You havent liked any posts or reviews yet.</Text>
                        <Text style={styles.subtitle}>Start exploring and find reviews that resonate with you!</Text>
                    </View>
                ) : (
                    likedPosts.map((post, index) => (
                        post.labels[0] === "Post" ?(
                            <Post
                                key={index} // for uniqueness
                                postId={post.properties.postId}
                                uid={post.properties.uid}
                                username={post.properties.name}
                                userHandle={post.userHandle}
                                userAvatar={post.properties.avatar}
                                postTitle={post.properties.postTitle}
                                likes={post.likesCount}
                                comments={post.commentsCount}
                                preview={post.properties.text}
                                saves={getRandomNumber(0, 18)}
                                image={post.properties.image || null}
                                isUserPost={post.properties.uid === userInfo.userId}
                                handleCommentPress={handleCommentPress}
                                datePosted={formatTimeAgoFromDB(post.properties.createdAt)}
                            />
                        ) : (
                            <Review 
                                key={index} // for uniqueness
                                reviewId={post.properties.reviewId}
                                uid={post.properties.uid}
                                username={post.properties.name}
                                userHandle={post.userHandle}
                                userAvatar={post.properties.avatar}
                                reviewTitle={post.properties.reviewTitle}
                                likes={post.likesCount}
                                comments={post.commentsCount}
                                preview={post.properties.text}
                                saves={getRandomNumber(0, 18)}
                                image={post.properties.image || null}
                                isUserPost={post.properties.uid === userInfo.userId}
                                handleCommentPress={handleCommentPress}
                                datePosted={formatTimeAgoFromDB(post.properties.createdAt)}
                                movieName={post.properties.movieName}
                                rating={post.properties.rating}
                            />
                        )

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
