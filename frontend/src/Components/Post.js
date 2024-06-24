import React, { useState, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../styles/ThemeContext";
import { removePost } from "../Services/PostsApiServices";

export default function Post({ username, userHandle, userAvatar, likes, comments, saves, image, postTitle, preview, datePosted }) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });

    const toggleLike = () => {
        setLiked(!liked);
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };
    
    // delete post

    const handleDelete = async () => {
        try {
            await removePost(postTitle);
            console.log("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post:", error);
        }   
    };

    // const handleDelete = () => {
    //     // Add delete logic here

    //     console.log("Delete post");
    //     closeModal();
    // };

    const handleEdit = () => {
        // Add edit logic here
        console.log("Edit post");
        closeModal();
    };

    const onIconLayout = (event) => {
        const { x, y } = event.nativeEvent.layout;
        setIconPosition({ x, y });
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
            marginRight: 5,
        },
        commentInput: {
            marginTop: 10,
            marginBottom: 10,
            color: theme.gray,
            fontSize: 13,
        },
        centeredView: {
            position: "absolute",
            top: iconPosition.y + 30,
            left: iconPosition.x - 50,
            zIndex: 1,
        },
        modalView: {
            width: 100,
            backgroundColor: "white",
            borderRadius: 10,
            padding: 10,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        button: {
            borderRadius: 10,
            padding: 10,
            elevation: 2,
            width: "100%",
            marginVertical: 2,
        },
        textStyle: {
            color: "black",
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
                <View style={{ alignItems: "flex-start" }}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.userHandle}>{userHandle} &bull; 3h</Text>
                </View>
                <TouchableOpacity onLayout={onIconLayout} onPress={openModal} style={{ marginLeft: "auto" }}>
                    <Icon name="more-vert" size={20}  />
                </TouchableOpacity>
            </View>
            {image && <Image source={{ uri: image }} style={styles.postImage} />}
            <Text style={styles.postTitle}>{postTitle}</Text>
            <Text style={styles.postPreview}>{preview}</Text>
            <View style={styles.statsContainer}>
                <TouchableOpacity style={styles.stats} onPress={toggleLike}>
                    <Icon name={liked ? "favorite" : "favorite-border"} size={20} color={liked ? "red" : "black"} style={styles.icon} />
                    <Text style={styles.statsNumber}>{likes}</Text>
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

            {modalVisible && (
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={handleEdit}>
                            <Text style={styles.textStyle}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={handleDelete}>
                            <Text style={styles.textStyle}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={closeModal}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
