import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Post from "./Post";

import { getUserLikedPosts } from "../Services/UsersApiService";

export default function LikesTab({userInfo, userProfile, handleCommentPress}) {

    const posts = [
        {
            username: "Mark Johnson",
            userHandle: "@markJ",
            userAvatar: "https://images.unsplash.com/photo-1544435253-f0ead49638fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww",
            likes: 120,
            comments: 25,
            saves: 15,
            postTitle: "I just love movies with cliches",
            preview: "The Dark Knight is not just a superhero film; it's a deep, complex story about morality, chaos, and heroism. Heath Ledger's Joker is a standout performance.",
            datePosted: "2024-06-02",
        },
        {
            username: "John Doe",
            userHandle: "@johnD",
            userAvatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww",
            likes: 150,
            comments: 12,
            saves: 20,
            image: "https://images.unsplash.com/photo-1635205411883-ae35d1169f60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGluY2VwdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
            postTitle: "Inception: A Mind-Bending Thriller",
            preview: "Inception is a sci-fi thriller that takes you on a journey through the dream world. The complex narrative and stunning visuals make it a must-watch.",
            datePosted: "2024-06-01",
        },
        {
            username: "Jane Smith",
            userHandle: "@janeS",
            userAvatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww",
            likes: 200,
            comments: 30,
            saves: 40,
            image: "https://plus.unsplash.com/premium_photo-1710324885138-d6b19ebaaefb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGF2YXRhciUyMG1vdmllfGVufDB8fDB8fHww",
            postTitle: "Interstellar: A Journey Beyond the Stars",
            preview: "Interstellar is a visually stunning and emotionally gripping sci-fi epic. Christopher Nolan's masterpiece explores themes of love, sacrifice, and the unknown.",
            datePosted: "2024-05-28",
        },
        {
            username: "Mark Johnson",
            userHandle: "@markJ",
            userAvatar: "https://images.unsplash.com/photo-1544435253-f0ead49638fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww",
            likes: 120,
            comments: 25,
            saves: 15,
            image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFyayUyMGtuaWdodHxlbnwwfHwwfHx8MA%3D%3D",
            postTitle: "The Dark Knight: A Masterclass in Storytelling",
            preview: "The Dark Knight is not just a superhero film; it's a deep, complex story about morality, chaos, and heroism. Heath Ledger's Joker is a standout performance.",
            datePosted: "2024-06-02",
        },

    ];
    const [likedPosts, setLikedPosts] = useState(posts);


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
        console.log(userInfo.userId)
        try {
            const userId = userInfo.userId;
            const response = await getUserLikedPosts(userId);
            console.log("Fetched likes", response);
            if (response.data === null) {
                setLikedPosts([]);
                return;
            }
            setLikedPosts(response.data);
        } catch (error) {
            console.log("Error fetching liked posts:", error);
        }
    }

    useEffect(() => {
        fetchLikedPosts();
    }, []);

    return (
        <View>
            <ScrollView>
                {likedPosts.length === 0 ? (
                    <View style={styles.container}>
                        <Text style={styles.title}>You haven't liked any posts or reviews yet.</Text>
                        <Text style={styles.subtitle}>Start exploring and find reviews that resonate with you!</Text>
                    </View>
                ) : (
                    likedPosts.map((post) => 
                    <Post
                        key={post.postId} // for uniqueness
                        postId={post.postId}
                        uid={post.uid}
                        username={post.username}
                        userHandle={post.userHandle}
                        userAvatar={post.avatar}
                        postTitle={post.postTitle}
                        likes={getRandomNumber(0, 100)} /** TODO: get actual number of likes */
                        comments={post.commentsCount || 0} /** Comments count */
                        preview={post.text}
                        saves={getRandomNumber(0, 18)}
                        image={post.image || null}
                        isUserPost={post.uid === userInfo.userId}
                        handleCommentPress={handleCommentPress}
                    />)
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