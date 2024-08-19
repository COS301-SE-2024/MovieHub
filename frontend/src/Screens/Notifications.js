import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { getUserNotifications } from '../Services/UsersApiService'; // Import from UsersApiService
import { markNotificationAsRead, deleteNotification, clearNotifications } from '../Services/NotifyApiService'; // Import from NotifyApiService
import BottomHeader from "../Components/BottomHeader";

const Notifications = ({ route }) => {
    const { userInfo } = route.params;
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getUserNotifications(userInfo.uid);
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, [userInfo.uid]);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(userInfo.uid, id);
            setNotifications(notifications.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            ));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await deleteNotification(userInfo.uid, id);
            setNotifications(notifications.filter((notification) => notification.id !== id));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleClearNotifications = async () => {
        try {
            await clearNotifications(userInfo.uid);
            setNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.notificationItem}>
            <Text style={[styles.notificationText, item.read ? styles.readText : styles.unreadText]}>
                {item.text}
            </Text>
            <View style={styles.buttonContainer}>
                {!item.read && (
                    <TouchableOpacity
                        style={[styles.button, styles.readButton]}
                        onPress={() => handleMarkAsRead(item.id)}
                    >
                        <Text style={styles.buttonText}>Mark as Read</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteNotification(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {notifications.length === 0 ? (
                <Text>No older Messages</Text>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <TouchableOpacity style={styles.clearButton} onPress={handleClearNotifications}>
                <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
            <BottomHeader userInfo={userInfo} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    listContainer: {
        paddingBottom: 24,
    },
    notificationItem: {
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
    },
    notificationText: {
        fontSize: 16,
    },
    readText: {
        color: "#888",
    },
    unreadText: {
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginLeft: 8,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    readButton: {
        backgroundColor: "#ddd",
    },
    deleteButton: {
        backgroundColor: "#000000",
    },
    clearButton: {
        backgroundColor: "#ff0000",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default Notifications;
