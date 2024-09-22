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
        height: 90,
        paddingTop: 28,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    logo: {
        paddingLeft: 20,
        fontFamily: 'Roboto',
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 0.4},
        textShadowRadius: 12
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: width * 0.03,  // Add space between icons
        paddingRight: 15,
    },
    iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
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
