import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../styles/theme';
import logo2 from "../../../assets/logo2.png";
import { getUnreadNotifications } from "../Services/UsersApiService";
import { getUserProfile } from "../Services/UsersApiService";

const { height, width } = Dimensions.get('window');

export default function HomeHeader({ userInfo }) {
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const navigation = useNavigation();
    const isActive = (screen) => route.name === screen;
    const route = useRoute();
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
            <Text style={styles.logo}>movieHub.</Text>
            <View style={styles.iconContainer}>
                {/* <Pressable style={styles.icon} onPress={() => navigation.navigate('Notifications', { userInfo })}>
                    <Icon name='notifications' size={28} color={"white"} style={styles.iconShadow} />
                </Pressable> */}
                <Pressable style={styles.icon} onPress={() => navigation.navigate('Notifications', { userInfo })}>
                    <View style={styles.notificationIconContainer}>
                        <Icon name="notifications" size={30} color={"white"} style={[styles.iconShadow, isActive("Notifications") && styles.activeIcon]} />
                        {unreadNotifications > 0 && (
                            <View style={styles.notificationBadge} />
                        )}
                    </View>
                    {isActive("Notifications") && <View style={styles.activeIndicator} />}
                </Pressable>
                <Pressable style={styles.icon} onPress={() => navigation.navigate('SearchPage', { userInfo })}>
                    <Icon name='search' size={30} color={"white"} style={styles.iconShadow} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: height * 0.12,      // Set header height as 12% of the screen height
        paddingTop: Platform.OS === 'ios' ? height * 0.04 : height * 0.03, // Adjust padding for status bar on iOS
        paddingHorizontal: width * 0.05, // 5% of screen width for left/right padding
        flexDirection: 'row',      // Horizontal alignment
        justifyContent: 'space-between', // Evenly space logo and icon
        zIndex: 1,
        alignItems: 'center',      // Vertical centering
        // backgroundColor: colors.primary, // Header background color
        elevation: 4,              // Shadow on Android
        shadowColor: '#000',       // Shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        position: 'relative',
    },
    logo: {
        color: colors.primary,            // White logo text
        fontSize: width * 0.06,    // Set font size relative to screen width (6% of width)
        fontWeight: 'bold',        // Bold logo
        fontFamily: 'Roboto',      // Custom font
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for the logo
        textShadowOffset: { width: -1, height: 0.4 },
        textShadowRadius: 12,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: width * 0.03,  // Add space between icons
    },
    iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow for the search icon
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    logoImage: {
        width: 200,
        height: 100,
        alignSelf: 'center',
        resizeMode: 'contain',
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
