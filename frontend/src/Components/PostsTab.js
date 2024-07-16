import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import Post from "./Post";
import { getUserPosts } from "../Services/UsersApiService";
import { useTheme } from "../styles/ThemeContext";

export default function PostsTab({ userInfo, userProfile }) {
    const { theme } = useTheme();
    const username = userProfile.name;
    const userHandle = "@" + userInfo.username;
    const avatar = userProfile.avatar;

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

    const [posts, setPosts] = useState(mockPosts);
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
    const fetchPosts = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserPosts(userId);
            // console.log("posts", response.data); // Ensure this logs the correct data structure
            setPosts(response.data); // Assuming response.data is an array of post objects
        } catch (error) {
            console.error("Error fetching posts:", error);
            // Handle error state or retry logic
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        console.log("posts", posts, posts.length);
    }, [posts]);
    
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
    });

    return (
        <View style={styles.outerContainer}>
            {/* <ScrollView> */}
                {posts.length === 0 ? (
                    <View style={styles.container}>
                        <Text style={styles.title}>Share your thoughts!</Text>
                        <Text style={styles.subtitle}>Create your first post</Text>
                    </View>
                ) : (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            username={username}
                            userHandle={userHandle}
                            userAvatar={avatar}
                            postTitle={post.properties.postTitle}
                            //  like = {14}
                            likes={getRandomNumber(0, 100)}
                            comments={getRandomNumber(0, 50)}
                            preview={post.properties.preview || post.properties.text}
                            saves={getRandomNumber(0, 18)}
                            image={post.properties.image}
                            isUserPost={post.properties.userId === userInfo.userId} // confirm this
                        />
                    ))
                )}
            {/* </ScrollView> */}
        </View>
    );
}
