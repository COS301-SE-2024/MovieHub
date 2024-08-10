import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { followUser, unfollowUser } from '../Services/UsersApiService';
import { removePost } from "../Services/PostsApiServices";
import { toggleLikePost } from "../Services/LikesApiService";

export default function NonFollowerPost({ username, userHandle, userAvatar, likes, comments, saves, image, postTitle, preview, datePosted, userInfo, otherUserInfo, uid }) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); 
    const [isFollowing, setIsFollowing] = useState(false);
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    const toggleLike = () => {
        setLiked(!liked);
    };

    const navigation = useNavigation();

    console.log("yayy User Info:", otherUserInfo);

    const handlePress = () => {
        navigation.navigate("Profile", {
            userInfo,
            otherUserInfo
        });
    };

    
 
    const toggleFollow = async () => {
        try {
            console.log("This is the current users info: ", userInfo);
            console.log("This is the other users info: ", otherUserInfo);
            if (isFollowing) {
                await unfollowUser(userInfo.userId, otherUserInfo.uid);
            } else {
                await followUser(userInfo.userId, otherUserInfo.uid);
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error toggling follow state:', error);
        }
    };

    // Calculate time difference
    const timeDifference = () => {
        const now = new Date();
        const postDate = new Date(datePosted);
        const diffInSeconds = (now - postDate) / 1000;
        const diffInHours = diffInSeconds / 3600;
        const diffInDays = diffInHours / 24;

        if (diffInDays >= 1) {
            return `${Math.floor(diffInDays)}d`;
        } else {
            return `${Math.floor(diffInHours)}h`;
        }
    };


    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
            paddingHorizontal: 10,
            paddingVertical: 15,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            // shadowOpacity: 0.17,
            // shadowRadius: 3.84,
            borderColor: '#000000',
            // elevation: 5,
            borderTopWidth: 0, 
            borderBottomWidth: 0.3, 
            borderTopWidth: 0.3,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
            backgroundColor: 'black',
        },
        username: {
            paddingBottom: 10,
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
            marginRight: 10,
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
            top: 30,
            right: 10,
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
            paddingVertical: 10,
            paddingHorizontal: 20,
        },
        modalText: {
            color: 'black',
            fontSize: 16,
        },
        moreIcon: {
            marginTop: -20,
            paddingLeft: 10,
        },
        followingButton: {
            backgroundColor: 'black',
            marginLeft: "auto",
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginTop: -20,
            width: 90, 
            alignItems: 'center',
            justifyContent: 'center',
            
        },
        followingText: {
            color: 'white',
            fontSize: 14,
        },
    });

    // const toggleFollow = () => {
    //     setIsFollowing(!isFollowing);
    // };

    

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <TouchableOpacity onPress={handlePress}>
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
                </TouchableOpacity>
                <View style={{ alignItems: "left" }}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.userHandle}>{userHandle} &bull; {timeDifference()}</Text>
                </View>
                <TouchableOpacity style={styles.followingButton} onPress={toggleFollow}>
                    <Text style={styles.followingText}>{isFollowing ? 'Following' : 'Follow'}</Text>
                </TouchableOpacity>
                <Icon name="more-vert" size={22} style={styles.moreIcon}></Icon>
                
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
                    <CommIcon name="comment-outline" size={20} style={styles.icon} />
                    <Text style={styles.statsNumber}>{comments}</Text>
                </View>
                <View style={styles.stats}>
                    <Icon name="bookmark-border" size={20} style={styles.icon} />
                    <Text style={styles.statsNumber}>{saves}</Text>
                </View>
                <View style={{ flex: 1 }}></View>
                <CommIcon name="share-outline" size={22} style={styles.icon} />
            </View>
            {modalVisible && (
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalOption} onPress={() => { /* Add edit functionality / }}>
                        <Text style={styles.modalText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption} onPress={() => { / Add delete functionality */ }}>
                        <Text style={styles.modalText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )} 
        </View>
    );
}

