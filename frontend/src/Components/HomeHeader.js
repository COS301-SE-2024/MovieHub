import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../styles/theme";
import { getUnreadNotifications, getUserProfile } from "../Services/UsersApiService";

const { width } = Dimensions.get("window");

export default function HomeHeader({ userInfo }) {
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [avatar, setAvatar] = useState();
    const navigation = useNavigation();
    const route = useRoute();

    const isActive = (screen) => route.name === screen;

    const fetchData = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserProfile(userId);
            setAvatar(response.avatar);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            try {
                const data = await getUnreadNotifications(userInfo.userId);
                setUnreadNotifications(data.unreadCount.unreadCount);
                console.log("Unread notifications length:", unreadNotifications);
                console.log("Unread notifications:", data.unreadCount.unreadCount);
            } catch (error) {
                console.error("Failed to fetch unread notifications", error);
            }
        };

        fetchUnreadNotifications();
    }, []);

    return (
        <View style={styles.header}>
            <Text style={styles.logo}>movieHub.</Text>
            <View style={styles.iconContainer}>
                <Pressable style={styles.icon} onPress={() => navigation.navigate("Notifications", { userInfo })}>
                    <View style={styles.notificationIconContainer}>
                        <Icon name="notifications" size={30} color={"white"} style={[styles.iconShadow, isActive("Notifications") && styles.activeIcon]} />
                        {unreadNotifications > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>{unreadNotifications}</Text>
                            </View>
                        )}
                    </View>
                    {isActive("Notifications") && <View style={styles.activeIndicator} />}
                </Pressable>
                <Pressable style={styles.icon} onPress={() => navigation.navigate("SearchPage", { userInfo })}>
                    <Icon name="search" size={30} color={"white"} style={styles.iconShadow} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 90,
        paddingTop: 28,
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 1,
    },
    logo: {
        paddingLeft: 20,
        fontFamily: "Roboto",
        color: colors.primary,
        fontSize: 20,
        fontWeight: "bold",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 0.4 },
        textShadowRadius: 12,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginLeft: width * 0.03, // Add space between icons
        paddingRight: 15,
    },
    iconShadow: {
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    notificationIconContainer: {
        position: "relative",
    },
    notificationBadge: {
        position: "absolute",
        top: -3,
        right: -3,
        backgroundColor: "#ff0000", // Red color for the dot
        borderRadius: 12,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationBadgeText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "bold",
    },
    activeIndicator: {
        height: 4,
        backgroundColor: colors.primary,
        borderRadius: 2,
        marginTop: 2,
    },
});
