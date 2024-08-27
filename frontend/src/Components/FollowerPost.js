import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, Share, Alert,Modal} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";

import { removePost } from "../Services/PostsApiServices";
import { toggleLikePost } from "../Services/LikesApiService";

export default function FollowerPost({ postId, uid, username, userHandle, userAvatar, likes, comments, saves, image, postTitle, preview, datePosted, isReview, isUserPost, handleCommentPress, onDelete, ogUserinfo }) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const [likedCount, setLikedCount] = useState(likes);
    const [saved, setSaved] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const navigation = useNavigation();

    // console.log("user likes:",uid);
    // console.log("user likes:",ogUserinfo);


    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleLike = async () => {
        const body = {
            postId: postId,
            userId: ogUserinfo.userId
        }

        try {
            await toggleLikePost(body);
            setLiked((prevLiked) => !prevLiked);
            setLikedCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
            console.log('Toggle like successful');
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                url: '',
                title: 'MovieHub',
                message: "Watch Party Invite | Join my watch party at ...[link]",
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

    const handleRemovePost = async (uid, postId) => {
        onDelete(postId);
        setConfirmationModalVisible(false);
        toggleModal();
        Alert.alert('Success', 'Post deleted successfully!');
    };

    const handleEditPost = () => {
        toggleModal();
        navigation.navigate("EditPost", { username, uid, titleParam: postTitle, thoughtsParam: preview, imageUriParam: image, postId });
    }

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
            borderBottomWidth: 0.5,
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
            backgroundColor: "white",
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
            color: "black",
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
            fontWeight: 'bold',
            textAlign: 'center',

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
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
                <View style={{ alignItems: "left" }}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.userHandle}>{userHandle} &bull; {datePosted}</Text>
                </View>
                <Pressable onPress={toggleModal} style={{ marginLeft: "auto" }}>
                    <Icon name="more-vert" size={20} />
                </Pressable>
            </View>
            {image && <Image source={{ uri: image }} style={styles.postImage} resizeMode="cover" />}
            <Text style={styles.postTitle}>{postTitle}</Text>
            <Text style={styles.postPreview}>{preview}</Text>
            <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.stats} onPress={toggleLike}>
                <Icon name={liked ? "favorite" : "favorite-border"} size={20} color={liked ? "red" : "black"} style={{ marginRight: 5 }} />
                <Text style={styles.statsNumber}>{liked ? likes + 1 : likes}</Text>
            </TouchableOpacity>
                <View style={styles.stats}>
                    <Pressable onPress={() => {handleCommentPress(postId, false)}}>
                        <CommIcon name="comment-outline" size={20} style={styles.icon} />
                    </Pressable>
                    <Text style={styles.statsNumber}>{comments}</Text>
                </View>
                <View style={styles.stats}>
                    <Icon name="bookmark-border" size={20} style={styles.icon} />
                    <Text style={styles.statsNumber}>{saves}</Text>
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
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={handleEditPost}>
                                <Text style={styles.modalText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {toggleConfirmationModal(postId);}}
                            >
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
            <Modal animationType="slide"
                visible={confirmationModalVisible}
                transparent ={true}
                
                onRequestClose={() => setConfirmationModalVisible(false)}>
                <View style={styles.confirmationModal}>
                    <View style={styles.confirmationContainer}>
                        <Text style={styles.confirmationText}>Are you sure you want to delete this post?</Text>
                        <TouchableOpacity
                            style={styles.confirmationButton}
                            onPress={() => {handleRemovePost(uid, postId);}}>
                            <Text style={styles.confirmationButtonText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.confirmationButton}
                            onPress={() => setConfirmationModalVisible(false)}>
                            <Text style={styles.confirmationButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}