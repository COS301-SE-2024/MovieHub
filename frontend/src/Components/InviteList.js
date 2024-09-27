import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { inviteUserToRoom } from '../Services/RoomApiService';

const InviteList = ({ route, uid, username, userHandle, userAvatar }) => {
    const { theme } = useTheme();
    const { userInfo } = route.params;
    const [isInvited, setIsInvited] = useState(false);

    const handleInvite = async (item) => {
        try {
            const response = await inviteUserToRoom(props.userInfo.userId, item.uid, roomId);
            console.log(response);
            Alert.alert("Success", "User invited successfully.");
        } catch (error) {
            Alert.alert("Error", error.message);
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
            borderRadius: 5,
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
            <TouchableOpacity style={[styles.followButton]}>
                <Text style={{ color: "white" }}>Invite</Text>
            </TouchableOpacity>
        </View>
    );
};

export default InviteList;
