import React from "react";
import { View, Text, Image, StyleSheet,ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import Post from "./Post";
import { getUserPosts } from "../Services/UsersApiService";
import { useTheme } from "../styles/ThemeContext";

export default function PostsTab() {
    const { theme } = useTheme();
    const username = "Itumeleng Moshokoa";
    const userHandle = "@Joyce";
    const avatar = "https://i.pinimg.com/originals/30/98/74/309874f1a8efd14d0500baf381502b1b.jpg";



    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const userId = 0;
            const posts = await getUserPosts(userId);
            console.log("posts", posts.data);
            setPosts(posts.data);
        };

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
    });

    return (
        <View style={styles.outerContainer}>
            <ScrollView>
            {posts.length === 0 ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Share your thoughts!</Text>
                    <Text style={styles.subtitle}>Create your first post</Text>
                </View>
            ) : (
                posts.map((post) => <Post 
                key={post.id}
                username={username} 
                userHandle={userHandle}
                userAvatar={avatar} 
                postTitle={post.properties.postTitle}
                likes={post.properties.likes.low}
                comments={post.properties.comments.low}
                preview={post.properties.preview}
                saves={post.properties.saves.low}
                image={post.properties.image} 
            />)
            )}
            </ScrollView>
        </View>
    );
}
