
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getUserProfile } from "../Services/UsersApiService";

import { colors } from "../styles/theme";
import { getUnreadNotifications } from "../Services/UsersApiService";

export default function BottomHeader({ userInfo }) {
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const isActive = (screen) => route.name === screen;
    const [loading, setLoading] = useState(true); // Add this line
    const [avatar, setAvatar] = useState(null)

    const fetchData = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserProfile(userId);
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

    useEffect(() => {
        // Fetch unread notifications count when the component mounts
        const fetchUnreadNotifications = async () => {
            try {
                const data = await getUnreadNotifications(userInfo.userId);
                
                setUnreadNotifications(data.unreadCount.unreadCount); // Adjust according to your API response
            } catch (error) {
                console.error("Failed to fetch unread notifications", error);
            }
        };

        fetchUnreadNotifications();
    }, [userInfo.userId]);

    return (
        <View style={styles.header}>
            <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => navigation.navigate("Home", { userInfo })} style={styles.iconContainer}>
                    <Icon name="home" size={30} style={[styles.icon, isActive("Home") && styles.activeIcon]} />
                    {isActive("Home") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ExplorePage", { userInfo })} style={styles.iconContainer}>
                    <Icon name="group" size={32} style={[styles.icon, isActive("ExplorePage") && styles.activeIcon]} />
                    {isActive("ExplorePage") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => navigation.navigate("Notifications", { userInfo })} style={styles.iconContainer}>
                    <View style={styles.notificationIconContainer}>
                        <Icon name="notifications" size={30} style={[styles.icon, isActive("Notifications") && styles.activeIcon]} />
                        {unreadNotifications > 0 && (
                            <View style={styles.notificationBadge} />
                        )}
                    </View>
                    {isActive("Notifications") && <View style={styles.activeIndicator} />}
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => navigation.navigate("CreatePost", { userInfo })} style={styles.iconContainer}>
                    <Icon name="add-circle-outline" size={30} style={[styles.icon, isActive("CreatePost") && styles.activeIcon]} />
                    {isActive("CreatePost") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("RoomsPage", { userInfo })} style={styles.iconContainer}>
                    <Icon name="personal-video" size={32} style={[styles.icon, isActive("RoomsPage") && styles.activeIcon]} />
                    {isActive("RoomsPage") && <View style={styles.activeIndicator} />}
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
    notificationIconContainer: {
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: "#ff0000", // Red color
        borderRadius: 5, // Circular dot
        width: 8, // Size of the dot
        height: 8,
    },
    notificationBadgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
