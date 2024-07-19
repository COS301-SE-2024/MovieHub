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

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const fetchPosts = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getPostsOfUser(userId);
            // console.log("Fetched posts:", response.data); // Log the response to verify the structure

            if (response.data === null) {
                setPosts([]);
            } else {
                const postsWithComments = await Promise.all(response.data.map(async (post) => {
                    const commentsResponse = await getCountCommentsOfPost(post.postId);
                    // console.log("Comments response for post", post.postId, ":", commentsResponse); // Log to verify structure
                    const commentsCount = commentsResponse.data.postCommentCount; // Adjust according to the actual structure
                    return { ...post, commentsCount };
                }));

                // Sort posts by createdAt in descending order (most recent first)
                postsWithComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setPosts(postsWithComments);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            // Handle error state or retry logic
        } finally {
            setLoading(false); // Set loading to false after fetch completes
        }
    };

//   const fetchPosts = async () => {
//     try {
//         const userId = 0;
//         const response = await getUserPosts(userId);
//         console.log("posts", response.data); // Ensure this logs the correct data structure
//         setPosts(response.data); // Assuming response.data is an array of post objects
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         // Handle error state or retry logic
//     }
// };

useEffect(() => {
    fetchPosts();
}, []);

    const styles = StyleSheet.create({
        outerContainer: {
            backgroundColor: theme.backgroundColor,
        },
        container: {
            backgroundColor: theme.backgroundColor,
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
                        username={post.username}
                        userHandle={userHandle}
                        userAvatar={post.avatar}
                        postTitle={post.postTitle}
                        likes={getRandomNumber(0, 100)} /** TODO: get actual number of likes */
                        comments={post.commentsCount || 0} /** Comments count */
                        preview={post.text}
                        saves={getRandomNumber(0, 18)}
                        image={post.image || null}
                        isUserPost={post.uid === userInfo.userId}
                        handleCommentPress={handleCommentPress}
                        datePosted={formatTimeAgoFromDB(post.createdAt)}
                    />
                ))
            )}
        </View>
    );
}
