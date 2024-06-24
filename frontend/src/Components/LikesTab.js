import React from "react";
import { View, Text, Image, StyleSheet , ScrollView} from "react-native";
import Post from "./Post";

export default function LikesTab() {
    
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

    return (
        <View>
            <ScrollView>
                {posts.length === 0 ? (
                    <View style={styles.container}>
                        <Text style={styles.title}>You haven't liked any reviews yet.</Text>
                        <Text style={styles.subtitle}>Start exploring and find reviews that resonate with you!</Text>
                    </View>
                ) : (
                    posts.map((post) => <Post username={post.username} userHandle={post.userHandle} key={post.postTitle} {...post} />)
                )}
            </ScrollView>
            
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
