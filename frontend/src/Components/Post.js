import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-web";

export default function Post({ username, userHandle, userAvatar, likes, comments, saves, image, postTitle, preview, datePosted }) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image source={userAvatar} style={styles.avatar} />
                <View style={{ alignItems: "left" }}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.userHandle}>{userHandle} &bull; 3h</Text>
                </View>
                <Icon name="more-vert" size={20} style={{ marginLeft: "auto" }}></Icon>
            </View>
            {image && <Image source={{ uri: image }} style={styles.postImage} />}
            <Text style={styles.postTitle}>{postTitle}</Text>
            <Text style={styles.postPreview}>{preview}</Text>
            <View style={styles.statsContainer}>
                <TouchableOpacity style={styles.stats}>
                    <Icon name={liked ? "favorite" : "favorite-border"} size={20} color={liked ? "red" : "black"} style={styles.icon} onPress={toggleLike} />
                    <Text>{likes}</Text>
                </TouchableOpacity>
                <View style={styles.stats}>
                    <CommIcon name="comment-outline" size={20} style={styles.icon} />
                    <Text>{comments}</Text>
                </View>
                <View style={styles.stats}>
                    <Icon name="bookmark-border" size={20} style={styles.icon} />
                    <Text>{saves}</Text>
                </View>
                <View style={{ flex: 1 }}></View>
                <CommIcon name="share-outline" size={20} style={styles.icon} />
            </View>
            <Text style={styles.commentInput}>Add a comment...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 25,
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.45,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    username: {
        fontSize: 18,
        fontWeight: "bold",
    },
    userHandle: {
        color: "#7b7b7b",
    },
    profileInfo: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
    },
    postImage: {
        width: "100%",
        height: 300,
        marginTop: 10,
        borderRadius: 10,
        objectFit: "cover",
    },
    postTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 10,
    },
    postPreview: {
        color: "#7b7b7b",
        marginVertical: 10,
        marginTop: 5,
    },
    icon: {
        marginRight: 5,
    },
    statsContainer: {
        display: "flex",
        flexDirection: "row",
    },
    stats: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    commentInput: {
        marginTop: 10,
        marginBottom: 10,
        color: "#7b7b7b",
        fontSize: 13,
    },
});
