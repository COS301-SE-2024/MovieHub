import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { followUser, unfollowUser } from "../Services/UsersApiService";

const FollowList = ({ route, uid, username, userHandle, userAvatar, isFollowing: initialFollowState }) => {
    const { theme } = useTheme();
    const { userInfo } = route.params;
    const [isFollowing, setIsFollowing] = useState(initialFollowState);

    const toggleFollow = async () => {
        try {
            const postBody = {
                followerId: userInfo.userId,
                followeeId: uid,
            };

            if (isFollowing) {
                await unfollowUser(postBody);
            } else {
                await followUser(postBody);
            }

            // triggers a re-render
            setIsFollowing((prev) => !prev);
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
            marginRight: 10,
            backgroundColor: "black",
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
            flexDirection: "row",
            alignItems: "center",
        },
        followButton: {
            backgroundColor: theme.primaryColor,
            padding: 8,
            borderRadius: 50,
            paddingHorizontal: 16,
        },
        followingButton: {
            backgroundColor: theme.gray,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
                <View>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.userHandle}>{userHandle}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={toggleFollow} style={[styles.followButton, isFollowing && styles.followingButton]}>
                <Text style={{ color: "white" }}>{isFollowing ? "Following" : "Follow"}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FollowList;
