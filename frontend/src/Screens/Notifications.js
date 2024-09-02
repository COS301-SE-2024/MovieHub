import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { getUserNotifications } from "../Services/UsersApiService"; // Import from UsersApiService
import { markNotificationAsRead, deleteNotification, clearNotifications } from "../Services/NotifyApiService"; // Import from NotifyApiService
import { joinRoom, declineRoomInvite } from "../Services/RoomApiService"; // Import RoomApiService
import BottomHeader from "../Components/BottomHeader";

const Notifications = ({ route }) => {
    const { userInfo } = route.params;
    const mockNotifications = [
        {
            id: "1",
            message: "You have a new message from John Doe",
            read: false,
            type: "messages",
            notificationType: "message",
        },
        {
            id: "2",
            message: "You have been invited to a room",
            read: false,
            type: "room_invitations",
            notificationType: "room_invite",
            shortCode: "XYZ123",
            roomId: "123",
        },
        {
            id: "3",
            message: "Your password was changed successfully",
            read: true,
            type: "system",
            notificationType: "system",
        },
        {
            id: "4",
            message: "username started following you",
            read: true,
            type: "follow",
            notificationType: "follow",
        },
    ];
    const [notifications, setNotifications] = useState(mockNotifications);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getUserNotifications(userInfo.userId);
                console.log("Fetched user notifications: ", data);

                const flattenedNotifications = [];
                if (data.success && data.notifications) {
                    for (const category in data.notifications) {
                        if (data.notifications.hasOwnProperty(category)) {
                            const notificationsOfCategory = data.notifications[category];
                            for (const id in notificationsOfCategory) {
                                if (notificationsOfCategory.hasOwnProperty(id)) {
                                    const notification = notificationsOfCategory[id];
                                    flattenedNotifications.push({
                                        id,
                                        ...notification,
                                        type: category,
                                    });
                                }
                            }
                        }
                    }
                }
                setNotifications(flattenedNotifications);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
    }, [userInfo.userId]);

    const handleMarkAsRead = async (id, type) => {
        try {
            await markNotificationAsRead(userInfo.userId, type, id);
            setNotifications(notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleDeleteNotification = async (id, type) => {
        try {
            await deleteNotification(userInfo.userId, type, id);
            setNotifications(notifications.filter((notification) => notification.id !== id));
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const handleClearNotifications = async () => {
        try {
            await clearNotifications(userInfo.userId);
            setNotifications([]);
        } catch (error) {
            console.error("Failed to clear notifications:", error);
        }
    };

    const handleAcceptInvite = async (shortCode, roomId) => {
        try {
            const response = await joinRoom(shortCode, userInfo.userId);
            console.log("Notification.js Accept func response:", JSON.stringify(response));
            if (response.roomId) {
                console.log("Joined room successfully:", response.roomId);
                handleDeleteNotification(roomId, "room_invitations");
            } else {
                console.error("Failed to join room:", response.message);
            }
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    const handleDeclineInvite = async (roomId) => {
        try {
            await declineRoomInvite(userInfo.userId, roomId);
            console.log(`Declined room invite with ID: ${roomId}`);
            handleDeleteNotification(roomId, "room_invitations");
            // TODO: remove the notification from the list
        } catch (error) {
            console.error("Error declining room invite:", error);
        }
    };

    const handleFollow = async (id) => {
        // TODO:Implement follow functionality here
        console.log(`Followed notification with ID: ${id}`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.notificationItem}>
            <Text style={[styles.notificationText, item.read ? styles.readText : styles.unreadText]}>{item.message}</Text>
            <View style={styles.buttonContainer}>
                {item.notificationType === "follow" && (
                    <TouchableOpacity style={[styles.button, styles.followButton]} onPress={() => handleFollow(item.id)}>
                        <Text style={styles.buttonText}>Follow</Text>
                    </TouchableOpacity>
                )}
                {item.notificationType === "room_invite" && (
                    <>
                        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAcceptInvite(item.shortCode, item.id)}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => handleDeclineInvite(item.roomId)}>
                            <Text style={styles.buttonText}>Decline</Text>
                        </TouchableOpacity>
                    </>
                )}
                {item.notificationType !== "room_invite" && (
                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteNotification(item.id, item.type)}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                {notifications.length === 0 ? (
                    <View style={styles.noNotificationsContainer}>
                        <Text style={styles.noNotificationsText}>You have no notifications at the moment</Text>
                    </View>
                ) : (
                    <View style={{ paddingHorizontal: 16, flex: 1 }}>
                        <FlatList
                            data={notifications}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.listContainer}
                        />
                        <TouchableOpacity style={styles.clearButton} onPress={handleClearNotifications}>
                            <Text style={styles.buttonText}>Clear All</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <BottomHeader userInfo={userInfo} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 24,
    },
    listContainer: {
        flexGrow: 1,
        marginHorizontal: 5,
    },
    notificationItem: {
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
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
    followButton: {
        backgroundColor: "#4a42c0", // Green button for follow
    },
    acceptButton: {
        backgroundColor: "#4CAF50", // Green button for accepting
    },
    declineButton: {
        backgroundColor: "#f44336", // Red button for declining
    },
    deleteButton: {
        backgroundColor: "#7b7b7b", // Blue button for deleting
    },
    clearButton: {
        backgroundColor: "#4a42c0",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
    },
    noNotificationsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noNotificationsText: {
        fontSize: 18,
        color: "#888",
        textAlign: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default Notifications;
