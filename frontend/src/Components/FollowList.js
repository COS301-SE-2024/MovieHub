import React from "react";
import { View, Text, Image, StyleSheet, } from "react-native";
import { useTheme } from "../styles/ThemeContext";

const FollowList = ({ route, username, userHandle, userAvatar, likes, saves, image, postTitle, preview, datePosted }) => {
    const { theme } = useTheme();

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
            borderColor: "#000000",
            borderTopWidth: 0,
            borderBottomWidth: 0.3,
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
    });

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
                <View style={{ alignItems: "left" }}>
                    <Text style={styles.username}>Itumeleng</Text>
                    <Text style={styles.userHandle}>@ElectricTance</Text>
                </View>
            </View>
            {image && <Image source={{ uri: image }} style={styles.postImage} />}
            <View style={styles.statsContainer}></View>
        </View>
    );
};

export default FollowList;
