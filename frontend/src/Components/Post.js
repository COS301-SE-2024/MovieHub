import React, { useRef, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, Share, Alert, Modal } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { toggleLikePost } from "../Services/LikesApiService";
import { useUser } from "../Services/UseridContext";

export default function Post({ postId, uid, username, userHandle, userAvatar, likes, comments, saves, image, postTitle, preview, datePosted, otherUserInfo, isUserPost, handleCommentPress, onDelete }) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const [hasLiked,setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const navigation = useNavigation();
    const { userInfo, setUserInfo } = useUser();
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleLike = async () => {
        if (liked) return;  // Prevent multiple actions
    
        setLiked(true);  // Immediately set liked to true to prevent double-clicking
    
        const body = {
            postId: postId,
            uid: uid,
        };

        try {
            await toggleLikePost(body);  // Await the backend like/unlike call
            setHasLiked(!hasLiked);  // Optimistically toggle like state
            setLikeCount(prevCount => hasLiked ? prevCount - 1 : prevCount + 1);  // Update like count
        } catch (error) {
            console.error("Error toggling like:", error);

        } finally {
            setLiked(false);  // Reset liked state after backend call completes

        }
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                url: "",
                title: "MovieHub",
                message: "Check this post out on MovieHub: " + postTitle,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const toggleConfirmationModal = (postId) => {
        setConfirmationModalVisible(!confirmationModalVisible);
    };

    // Function to remove posts

    // Function to remove posts

    const handleRemovePost = async (uid, postId) => {
        if (isDeleting) return; // Prevent multiple deletes

    setIsDeleting(true); // Prevent further actions
    try {
        onDelete(postId);
        setConfirmationModalVisible(false);
        toggleModal();
        Alert.alert("Success", "Post deleted successfully!");

    } catch (error) {
        console.error("Error deleting post:", error);
    } finally {
        setIsDeleting(false); // Reset flag after completion
    }
};

    const handleEditPost = () => {
        toggleModal();
        navigation.navigate("EditPost", { username, uid, titleParam: postTitle, thoughtsParam: preview, imageUriParam: image, postId });
    };

    const handlePress = () => {
        // if user owns post, return
        if (isUserPost) {
            return;
        }
        navigation.navigate("Profile", {
            userInfo,
            otherUserInfo,
            isFollowing: true
        });
    };

    // TODO: Increment or decrement number of likes

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
            paddingHorizontal: 25,
            paddingVertical: 15,
            // shadowColor: "#000",
            // shadowOffset: {
            //     width: 0,
            //     height: 2,
            // },
            // shadowOpacity: 0.45,
            // shadowRadius: 3.84,
            // elevation: 5,
            borderBottomWidth: 0.8,
            borderBottomColor: theme.borderColor,
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
            height: 400,
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
            color: theme.textColor,
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
        commentInput: {
            marginTop: 10,
            marginBottom: 10,
            color: theme.gray,
            fontSize: 13,
        },
        modalContainer: {
            position: "absolute",
            top: 50,
            right: 30,
            backgroundColor: theme.backgroundColor,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.45,
            shadowRadius: 3.84,
            elevation: 5,
            padding: 10,
            zIndex: 1000,
        },
        modalOption: {
            paddingVertical: 8,
            paddingHorizontal: 20,
        },
        modalText: {
            color: theme.textColor,
            fontSize: 16,
        },
        confirmationModal: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        confirmationContainer: {
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            width: "80%",
            alignItems: "center",
        },
        confirmationText: {
            fontSize: 16,
            marginBottom: 20,
            fontWeight: "bold",
            textAlign: "center",
        },
        confirmationButton: {
            marginTop: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 10,
            backgroundColor: "black",
            alignItems: "center",
            width: "70%",
            marginBottom: 5,
        },
        confirmationButtonText: {
            color: "white",
            fontSize: 16,
        },
        modalOverlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Pressable style={{ display: "flex", flexDirection: "row", alignItems: "center" }} onPress={handlePress}>
                    <Image source={{ uri: userAvatar }} style={styles.avatar} />
                    {/* <Image source={{ uri: userAvatar }} style={styles.avatar} /> */}
                    <View style={{ alignItems: "left" }}>
                        <Text style={styles.username}>{username}</Text>
                        <Text style={styles.userHandle}>
                            {userHandle} &bull; {datePosted}
                        </Text>
                    </View>
                </Pressable>
                <Pressable onPress={toggleModal} style={{ marginLeft: "auto" }}>
                    <Icon name="more-vert" size={20} color={theme.iconColor} />
                </Pressable>
            </View>
            {image && <Image source={{ uri: image }} style={styles.postImage} resizeMode="cover" />}
            <Text style={styles.postTitle}>{postTitle}</Text>
            <Text style={styles.postPreview}>{preview}</Text>
            <View style={styles.statsContainer}>
                <TouchableOpacity style={styles.stats} onPress={toggleLike}>
                    <Icon name={liked ? "favorite" : "favorite-border"} size={20} color={liked ? "red" : "black"} style={styles.icon} />
                    <Text style={styles.statsNumber}>{likes}</Text>
                </TouchableOpacity>
                <View style={styles.stats}>
                    <Pressable
                        onPress={() => {
                            handleCommentPress(postId, false);
                        }}>
                        <CommIcon name="comment-outline" size={20} style={styles.icon} />
                    </Pressable>
                    <Text style={styles.statsNumber}>{comments > 0 ? comments : 0}</Text>
                </View>
                <View style={{ flex: 1 }}></View>
                <Pressable onPress={handleShare}>
                    <CommIcon name="share-outline" size={20} style={styles.icon} />
                </Pressable>
            </View>
            {modalVisible && (
                <View style={styles.modalContainer}>
                    {isUserPost ? ( // Check if the post belongs to the user
                        <>
                            <TouchableOpacity style={styles.modalOption} onPress={handleEditPost}>
                                <Text style={styles.modalText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {
                                    toggleConfirmationModal(postId);
                                }}>
                                <Text style={styles.modalText}>Delete</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                /* Report logic */
                            }}>
                            <Text style={styles.modalText}>Report</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            <Modal animationType="slide" visible={confirmationModalVisible} transparent={true} onRequestClose={() => setConfirmationModalVisible(false)}>
                <View style={styles.confirmationModal}>
                    <View style={styles.confirmationContainer}>
                        <Text style={styles.confirmationText}>Are you sure you want to delete this post?</Text>
                        <TouchableOpacity
                            style={styles.confirmationButton}
                            onPress={() => {
                                handleRemovePost(uid, postId);
                            }}>
                            <Text style={styles.confirmationButtonText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmationButton} onPress={() => setConfirmationModalVisible(false)}>
                            <Text style={styles.confirmationButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
