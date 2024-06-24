import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../styles/ThemeContext";
import { toggleLikePost } from "../Services/LikesApiService"; // Assuming this service function exists

export default function Post({
    postId, // Added postId for the like functionality
    username,
    userHandle,
    userAvatar,
    likes,
    comments,
    saves,
    image,
    postTitle,
    preview,
    datePosted
}) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [saved, setSaved] = useState(false);

    const toggleLike = async () => {
        try {
            const updatedPost = await toggleLikePost({ postId, liked: !liked });
            setLiked(!liked);
            setLikeCount(updatedPost.likes);
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
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
            color: theme.textColor,
        },
        userHandle: {
            color: theme.gray,
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
            color: theme.textColor,
        },
        postPreview: {
            color: theme.gray,
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
        statsNumber: {
            color: theme.textColor,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
                <View>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.userHandle}>{userHandle} &bull; {datePosted}</Text>
                </View>
                <Icon name="more-vert" size={20} style={{ marginLeft: "auto" }} />
            </View>
            {image && <Image source={{ uri: image }} style={styles.postImage} />}
            <Text style={styles.postTitle}>{postTitle}</Text>
            <Text style={styles.postPreview}>{preview}</Text>
            <View style={styles.statsContainer}>
                <TouchableOpacity style={styles.stats} onPress={toggleLike}>
                    <Icon
                        name={liked ? "favorite" : "favorite-border"}
                        size={20}
                        color={liked ? "red" : "black"}
                        style={styles.icon}
                    />
                    <Text style={styles.statsNumber}>{likeCount}</Text>
                </TouchableOpacity>
                <View style={styles.stats}>
                    <CommIcon name="comment-outline" size={20} style={styles.icon} />
                    <Text style={styles.statsNumber}>{comments}</Text>
                </View>
                <View style={styles.stats}>
                    <Icon name="bookmark-border" size={20} style={styles.icon} />
                    <Text style={styles.statsNumber}>{saves}</Text>
                </View>
                <View style={{ flex: 1 }}></View>
                <CommIcon name="share-outline" size={20} style={styles.icon} />
            </View>
        </View>
    );
}
