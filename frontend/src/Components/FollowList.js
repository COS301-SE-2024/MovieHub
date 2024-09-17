import React, { useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, Share, Alert} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";

import { removePost } from "../Services/PostsApiServices";
import { toggleLikePost } from "../Services/LikesApiService";

const FollowList = ({ route, username, userHandle, userAvatar, avatar, }) => {

    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#ffffff',
            paddingHorizontal: 25,
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
            // borderTopWidth: 0, 
            // borderBottomWidth: 0.3, 
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
                    <Text style={styles.username}>{userHandle}</Text>
                    <Text style={styles.userHandle}>{username}</Text>
                </View>
            </View>
            {avatar && <Image source={{ uri: avatar }} style={styles.postImage} />}
            <View style={styles.statsContainer}>
    
            </View>
            
                </View>
    );
};



export default FollowList;