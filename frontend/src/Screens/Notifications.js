import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import BottomHeader from "../Components/BottomHeader";

import { themeStyles } from "../styles/theme";

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New message from John", read: false },
        { id: 2, text: "You have 3 new followers", read: true },
        { id: 3, text: "Reminder: Complete your profile", read: false },
        { id: 4, text: "Your post got 50 likes", read: true },
        { id: 5, text: "Event reminder: Watch Party at 3!", read: false },
        { id: 6, text: "New message from Kamo", read: true },
        { id: 7, text: "New message from Lily", read: true },
        { id: 8, text: "New message from John", read: true },
        { id: 9, text: "New message from Barry", read: true },
        { id: 10, text: "New message from John", read: true },
    ]);

    const markAsRead = (id) => {
        const updatedNotifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
    };

    const deleteNotification = (id) => {
        const updatedNotifications = notifications.filter((notification) => notification.id !== id);
        setNotifications(updatedNotifications);
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
                        onPress={() => markAsRead(item.id)}
                    >
                        <Text style={styles.buttonText}>Mark as Read</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => deleteNotification(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>

        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />            
            <BottomHeader />
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
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default Notifications;
