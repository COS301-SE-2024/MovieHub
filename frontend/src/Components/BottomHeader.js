import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getUserProfile } from "../Services/UsersApiService";

import { colors } from "../styles/theme";

export default function BottomHeader({ userInfo }) {
    const navigation = useNavigation();
    const route = useRoute();
    console.log("The users info in BottomHeader.js: ", userInfo);
    const isActive = (screen) => route.name === screen;
    const [loading, setLoading] = useState(true); // Add this line
    const [avatar, setAvatar] = useState(null)

    const fetchData = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserProfile(userId);
            console.log("Response:", response);
            setAvatar(response.avatar)

        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false); // Set loading to false after data is fetched
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        ///// add user info parameter to other pages as necessary /////////
        <View style={styles.header}>
            <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => navigation.navigate("Home", { userInfo })} style={styles.iconContainer}>
                    <Icon name="home" size={30} style={[styles.icon, isActive("Home") && styles.activeIcon]} />
                    {isActive("Home") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Notifications", { userInfo })} style={styles.iconContainer}>
                    <Icon name="notifications" size={30} style={[styles.icon, isActive("Notifications") && styles.activeIcon]} />
                    {isActive("Notifications") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => navigation.navigate("CreatePost", { userInfo })} style={styles.iconContainer}>
                    <Icon name="add-circle-outline" size={30} style={[styles.icon, isActive("CreatePost") && styles.activeIcon]} />
                    {isActive("CreatePost") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ExplorePage", { userInfo })} style={styles.iconContainer}>
                    <Icon name="people" size={32} style={[styles.icon, isActive("ExplorePage") && styles.activeIcon]} />
                    {isActive("ExplorePage") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ProfilePage", { userInfo })} style={styles.iconContainer}>
                    <Image 
                        source={{ uri: avatar }} 
                        style={[styles.image, isActive("ProfilePage") && styles.activeImage]} 
                    />
                    {isActive("ProfilePage") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 65,
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        color: colors.black,
    },
    activeIcon: {
        color: colors.primary,
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 2
    },
    activeImage: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    activeIndicator: {
        width: 5,
        height: 5,
        backgroundColor: colors.primary,
        borderRadius: 2.5,
        marginTop: 4,
    },
});
