import React, { useRef, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, Share, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";
import {useUser} from "../Services/UseridContext";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { followUser, unfollowUser } from "../Services/UsersApiService";

import { toggleLikePost, checkUserLike } from "../Services/LikesApiService";

export default function NonFollowerPost({ username, userHandle, userAvatar, likes, comments, saves, image, postTitle, preview, datePosted, userInfo, otherUserInfo, uid, isUserPost, handleCommentPress, postId }) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [hasLiked,setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [modalVisible, setModalVisible] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const { oguserInfo, setUserInfo } = useUser();

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleLike = async () => {
        if (liked) return; 
    
        setLiked(true);

        const body = {
            postId: postId,
            uid: userInfo.userId
        }

        try {
            await toggleLikePost(body);
            setHasLiked(!hasLiked);
            setLikeCount(prevCount => hasLiked ? prevCount - 1 : prevCount + 1);
        } catch (error) {
            console.error('Error toggling like:', error);
        }

        setLiked(!liked);
    };

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const data = await checkUserLike(userInfo.userId, postId, 'Post');
                setHasLiked(data.hasLiked); 
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        fetchLikeStatus();
    }, [userInfo.userId, postId]);

    const handleShare = async () => {
        try {
            const result = await Share.share({
                url: "",
                title: "MovieHub",
                message: "Check this post out on MovieHub: " + postTitle,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    
                } else {
                    
                }
            } else if (result.action === Share.dismissedAction) {
                
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("Profile", {
            userInfo,
            otherUserInfo,
        });
    };

    const toggleFollow = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(userInfo.userId, otherUserInfo.uid);
            } else {
                await followUser(userInfo.userId, otherUserInfo.uid);
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Error toggling follow state:", error);
        }
    };

    // Calculate time difference
    const timeDifference = () => {
        const now = new Date();
        const postDate = new Date(datePosted);
        const diffInSeconds = (now - postDate) / 1000;
        const diffInHours = diffInSeconds / 3600;
        const diffInDays = diffInHours / 24;
        const diffInMonths = diffInDays / 30;
        const diffInYears = diffInMonths / 12;

        if (diffInYears >= 1) {
            return `${Math.floor(diffInYears)}y`;
        } else if (diffInMonths >= 1) {
            return `${Math.floor(diffInMonths)}mo`;
        } else if (diffInDays >= 1) {
            return `${Math.floor(diffInDays)}d`;
        } else {
            return `${Math.floor(diffInHours)}h`;
        }
    };

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
            borderColor: "#000000",
            borderTopWidth: 0,
            borderBottomWidth: 0.3,
            // borderTopWidth: 0.3,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
            backgroundColor: "black",
        },
        username: {
            paddingBottom: 4,
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
            marginRight: 10,
            flexShrink: 1,
            maxWidth: "95%", // Adjust as needed
        },
        userHandle: {
            color: theme.gray,
        },
        profileInfo: {
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            flex: 1,
        },
        nameAndHandleContainer: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1, // This will allow the username and follow button to share the space equally
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
        commentInput: {
            marginTop: 10,
            marginBottom: 10,
            color: theme.gray,
            fontSize: 13,
        },
        modalContainer: {
            position: "absolute",
            top: 30,
            right: 10,
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
            paddingVertical: 10,
            paddingHorizontal: 20,
        },
        modalText: {
            color: "black",
            fontSize: 16,
        },
        moreIcon: {
            paddingLeft: 10,
        },
        followingButton: {
            backgroundColor: isFollowing ? "grey" : "#4a42c0", // Dynamic background color
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
            width: 90,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
            marginRight: 4,
        },
        followingText: {
            color: "white",
            fontSize: 14,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <TouchableOpacity onPress={handlePress}>
                    <Image source={{ uri: userAvatar }} style={styles.avatar} />
                </TouchableOpacity>
                <View style={styles.nameAndHandleContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                            {userHandle}
                        </Text>
                        <Text style={styles.userHandle}>
                            {username} &bull; {timeDifference()}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 18 }}>
                    <TouchableOpacity style={styles.followingButton} onPress={toggleFollow}>
                        <Text style={styles.followingText}>{isFollowing ? "Following" : "Follow"}</Text>
                    </TouchableOpacity>
                    <Pressable onPress={toggleModal} style={{ marginLeft: "auto" }}>
                        <Icon name="more-vert" size={20} />
                    </Pressable>
                </View>
            </View>
            {image && <Image source={{ uri: image }} style={styles.postImage} />}
            <Text style={styles.postTitle}>{postTitle}</Text>
            <Text style={styles.postPreview}>{preview}</Text>
            <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.stats} onPress={toggleLike}>
                <Icon
                    name={hasLiked ? 'favorite' : 'favorite-border'}
                    size={20}
                    color={hasLiked ? 'red' : 'black'}
                    style={{ marginRight: 5 }}
                />
                    <Text style={styles.statsNumber}>{likeCount}</Text>
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
        </View>
    );
}