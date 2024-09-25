import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { followUser, unfollowUser } from "../Services/UsersApiService";

const FollowList = ({ route, uid, username, userHandle, userAvatar, avatar, isFollowing }) => {
    const { theme } = useTheme();
    const { userInfo } = route.params;

    console.log("isFollowing", isFollowing);

    const toggleFollow = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(userInfo.userId, uid);
            } else {
                await followUser(userInfo.userId, uid);
            }
        } catch (error) {
            console.error("Error toggling follow state:", error);
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
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
            paddingLeft: 10,
        },
        username: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
            paddingLeft: 15,
        },
        userHandle: {
            color: theme.gray,
            paddingLeft: 15,
        },
        profileInfo: {
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
        },
        followButton: {
            backgroundColor: theme.primaryColor,
            padding: 8,
            borderRadius: 5,
            paddingHorizontal: 16
        },
        followingButton: {
            backgroundColor: theme.gray,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
                <View style={{ alignItems: "left" }}>
                    <Text style={styles.username}>{userHandle}</Text>
                    <Text style={styles.userHandle}>{username}</Text>
                </View>
            </View>
            {/* {avatar && <Image source={{ uri: avatar }} style={styles.postImage} />} */}
            <TouchableOpacity onPress={toggleFollow} style={[styles.followButton, isFollowing && styles.followingButton]}>
                <Text style={{ color: "white" }}>{isFollowing ? "Following" : "Follow"}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FollowList;
