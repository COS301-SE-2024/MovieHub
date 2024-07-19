import React, { useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, Share, Alert} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";

import { removePost } from "../Services/PostsApiServices";
import { toggleLikePost } from "../Services/LikesApiService";

export default function Post({ postId, uid, username, userHandle, userAvatar, likes, comments, saves, image, postTitle, preview, datePosted, isReview, isUserPost, handleCommentPress }) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleLike = async () => {
        const body = {
            postId: postId,
            userId: uid
        }

        try {
            await toggleLikePost(body);
            console.log('Toggle like successful');
        } catch (error) {
            console.error('Error toggling like:', error);
        }

        setLiked(!liked);
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
    // Function to remove posts

    const handleRemovePost = async (uid, postId) => {
        try {
            //
            console.log('Removing post:', postId + ' by ' + uid);
            const postBody = {
                postId: postId,
                uid: uid
            }
            await removePost(postBody);
            // console.log('Post removed successfully');
            Alert.alert(null,'Post removed successfully');
        } catch (error) {
            console.error('Error removing post:', error);
            throw new Error('Failed to remove post' + error);
        }
    };

    // TODO: Increment or decrement number of likes

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
        commentInput: {
            marginTop: 10,
            marginBottom: 10,
            color: theme.gray,
            fontSize: 13,
        },
        modalContainer: {
            position: 'absolute',
            top: 50,
            right: 30,
            backgroundColor: 'white',
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
            color: 'black',
            fontSize: 16,
        }
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
            {image && <Image source={{ uri: image }} style={styles.postImage} />}
            <Text style={styles.postTitle}>{postTitle}</Text>
            <Text style={styles.postPreview}>{preview}</Text>
            <View style={styles.statsContainer}>
                <TouchableOpacity style={styles.stats}>
                    <Icon name={liked ? "favorite" : "favorite-border"} size={20} color={liked ? "red" : "black"} style={{ marginRight: 5,}} onPress={toggleLike} />
                    <Text style={styles.statsNumber}>{likes}</Text>
                </TouchableOpacity>
                <View style={styles.stats}>
                    <Pressable onPress={() => {handleCommentPress(postId)}}>
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
                                onPress={() => {
                                    navigation.navigate("EditPost", { username, uid, titleParam: postTitle, thoughtsParam: preview, imageUriParam: image, postId });
                                }}>
                                <Text style={styles.modalText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {handleRemovePost(uid, postId);}}
                            >
                                <Text style={styles.modalText}>Delete</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.modalOption} onPress={() => { /* Report logic */ }}>
                            <Text style={styles.modalText}>Report</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )} 
        </View>
    );
}

