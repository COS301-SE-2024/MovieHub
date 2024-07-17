import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import Post from "./Post";
import { getPostsOfUser, getCountCommentsOfPost } from "../Services/PostsApiServices";

export default function PostsTab({ userInfo, userProfile, handleCommentPress }) {
    const { theme } = useTheme();
    const username = userProfile.name;
    const userHandle = "@" + userInfo.username;
    const avatar = userProfile.avatar;
    const navigation = useNavigation();

    const mockPosts = [
        {
            id: 1,
            properties: {
                postTitle: "I just love movies with cliches",
                preview: "The Dark Knight is not just a superhero film; it's a deep, complex story about morality, chaos, and heroism. Heath Ledger's Joker is a standout performance.",
                image: null, // No image for this post
                userId: userInfo.userId,
                isReview: false
            },
        },
        {
            id: 2,
            properties: {
                postTitle: "Inception: A Mind-Bending Thriller",
                preview: "Inception is a sci-fi thriller that takes you on a journey through the dream world. The complex narrative and stunning visuals make it a must-watch.",
                image: "https://images.unsplash.com/photo-1635205411883-ae35d1169f60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGluY2VwdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
                userId: userInfo.userId
            },
        },
        {
            id: 3,
            properties: {
                postTitle: "Interstellar: A Journey Beyond the Stars",
                preview: "Interstellar is a visually stunning and emotionally gripping sci-fi epic. Christopher Nolan's masterpiece explores themes of love, sacrifice, and the unknown.",
                image: "https://plus.unsplash.com/premium_photo-1710324885138-d6b19ebaaefb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGF2YXRhciUyMG1vdmllfGVufDB8fDB8fHww",
                userId: userInfo.userId
            },
        },
    ];

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const fetchPosts = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getPostsOfUser(userId);
            console.log("Fetched posts:", response.data); // Log the response to verify the structure

            if (response.data === null) {
                setPosts([]);
            } else {
                const postsWithComments = await Promise.all(response.data.map(async (post) => {
                    const commentsResponse = await getCountCommentsOfPost(post.postId);
                    console.log("Comments response for post", post.postId, ":", commentsResponse); // Log to verify structure
                    const commentsCount = commentsResponse.data.postCommentCount; // Adjust according to the actual structure
                    return { ...post, commentsCount };
                }));

                setPosts(postsWithComments);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            // Handle error state or retry logic
        } finally {
            setLoading(false); // Set loading to false after fetch completes
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const styles = StyleSheet.create({
        outerContainer: {
            backgroundColor: theme.backgroundColor,
            flex: 1,
        },
        container: {
            backgroundColor: theme.backgroundColor,
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
            color: "#0f5bd1",
            fontWeight: "600",
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
    });

    if (loading) {
        return (
            <View style={{ paddingTop: 50 }}>
                <ActivityIndicator size="large" color="#4a42c0" />
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            {posts.length === 0 ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Share your thoughts!</Text>
                    <Pressable onPress={() => navigation.navigate("CreatePost", { userInfo })}>
                        <Text style={styles.subtitle}>Create your first post</Text>
                    </Pressable>
                </View>
            ) : (
                posts.map((post) => (
                    <Post
                        key={post.postId} // for uniqueness
                        postId={post.postId}
                        uid={post.uid}
                        username={username}
                        userHandle={userHandle}
                        userAvatar={avatar}
                        postTitle={post.postTitle}
                        likes={getRandomNumber(0, 100)} /** TODO: get actual number of likes */
                        comments={post.commentsCount || 0} /** Comments count */
                        preview={post.text}
                        saves={getRandomNumber(0, 18)}
                        image={post.image || null}
                        isUserPost={post.uid === userInfo.userId}
                        handleCommentPress={handleCommentPress}
                    />
                ))
            )}
        </View>
    );
}
