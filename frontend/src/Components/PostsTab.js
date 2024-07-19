import React from "react";
import { View, Text, Image, StyleSheet,ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import Post from "./Post";
import { getUserPosts } from "../Services/UsersApiService";
import { useTheme } from "../styles/ThemeContext";

export default function PostsTab({ userInfo, userProfile, handleCommentPress }) {
    const { theme } = useTheme();
    const username = "Itumeleng Moshokoa";
    const userHandle = "@Joyce";
    const avatar = "https://i.pinimg.com/originals/30/98/74/309874f1a8efd14d0500baf381502b1b.jpg";



    const [posts, setPosts] = useState([]);
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // TODO: resolve adding posts
    const fetchPosts = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserPosts(userId);
            console.log("posts", response.data); // Ensure this logs the correct data structure
            setPosts(response.data); // Assuming response.data is an array of post objects
        } catch (error) {
            console.error("Error fetching posts:", error);
            // Handle error state or retry logic
        }
    };

  const fetchPosts = async () => {
    try {
        const userId = 0;
        const response = await getUserPosts(userId);
        console.log("posts", response.data); // Ensure this logs the correct data structure
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
        // console.log("posts", posts, posts.length);
    }, [posts]);
    
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
                            id={post.id}
                            username={username}
                            userHandle={userHandle}
                            userAvatar={avatar}
                            postTitle={post.properties.postTitle}
                            //  like = {14}
                            likes={getRandomNumber(0, 100)} /** TODO: get actual number of likes */
                            comments={getRandomNumber(0, 50)} /** TODO: get actual number of comments */
                            preview={post.properties.preview || post.properties.text}
                            saves={getRandomNumber(0, 18)}
                            image={post.properties.image}
                            isUserPost={post.properties.userId === userInfo.userId} // confirm this
                            handleCommentPress={handleCommentPress}
                        />
                    ))
                )}
            {/* </ScrollView> */}
        </View>
    );
}
