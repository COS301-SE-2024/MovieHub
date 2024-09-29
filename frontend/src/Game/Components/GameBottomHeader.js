import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../../styles/ThemeContext";
import { getUserProfile } from "../../Services/UsersApiService";
import { useUser } from "../../Services/UseridContext";

export default function GameBottomHeader({  }) {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { userInfo } = useUser();
    const route = useRoute();
    const [loading, setLoading] = useState(true); // Add this line
    const [avatar, setAvatar] = useState(null);
    const isActive = (screen) => route.name === screen;
    const fetchData = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserProfile(userId);
            setAvatar(response.avatar);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false); // Set loading to false after data is fetched
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const styles = StyleSheet.create({
        header: {
            height: 65,
            backgroundColor: theme.backgroundColor,
            justifyContent: "center",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: theme.borderColor,
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
            color: theme.iconColor,
        },
        activeIcon: {
            color: theme.primaryColor,
        },
        image: {
            height: 40,
            width: 40,
            borderRadius: 20,
            borderColor: theme.iconColor,
            borderWidth: 2,
        },
        activeImage: {
            borderColor: theme.primaryColor,
            borderWidth: 2,
        },
        activeIndicator: {
            width: 5,
            height: 5,
            backgroundColor: theme.primaryColor,
            borderRadius: 2.5,
            marginTop: 4,
        },
        notificationIconContainer: {
            position: "relative",
        },
        notificationBadge: {
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "#ff0000", // Red color
            borderRadius: 5, // Circular dot
            width: 8, // Size of the dot
            height: 8,
        },
        notificationBadgeText: {
            color: theme.textColor,
            fontSize: 12,
            fontWeight: "bold",
        },
    });

    return (
        <View style={styles.header}>
            <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => navigation.navigate("GameProfile", { userInfo })} style={styles.iconContainer}>
                    <Icon name="home" size={30} style={[styles.icon, isActive("GameProfile") && styles.activeIcon]} />
                    {isActive("GameProfile") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Quiz", { userInfo })} style={styles.iconContainer}>
                    <IonIcon name="game-controller" size={32} style={[styles.icon, isActive("Quiz") && styles.activeIcon]} />
                    {isActive("Quiz") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Leaderboard", { userInfo })} style={styles.iconContainer}>
                    <Icon name="leaderboard" size={32} style={[styles.icon, isActive("Leaderboard") && styles.activeIcon]} />
                    {isActive("Leaderboard") && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
            </View>
        </View>
    );
}
