import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { followUser, getUserNotifications, unfollowUser } from "../Services/UsersApiService"; // Import from UsersApiService
import { markNotificationAsRead, deleteNotification, clearNotifications } from "../Services/NotifyApiService"; // Import from NotifyApiService
import { joinRoom, declineRoomInvite } from "../Services/RoomApiService"; // Import RoomApiService
import BottomHeader from "../Components/BottomHeader";
import moment from "moment"; // Use moment.js for date formatting

const Notifications = ({ route }) => {
    const { userInfo } = route.params;
    const { theme, isDarkMode } = useTheme();
    const [notifications, setNotifications] = useState([
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
    ]);

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
                                        timestamp: moment(notification.timestamp), // Ensure notification has a timestamp
                                    });
                                }
                            }
                        }
                    }
                }
                flattenedNotifications.sort((a, b) => b.timestamp - a.timestamp);
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
        } catch (error) {
            console.error("Error declining room invite:", error);
        }
    };

    const handleFollow = async (isFollowing, followerId) => {
        // TODO:Implement follow functionality here
        try {
            if (isFollowing) {
                await unfollowUser(userInfo.userId, otherUserInfo.uid);
            } else {
                await followUser(userInfo.userId, otherUserInfo.uid);
            }
        } catch (error) {
            console.error("Error toggling follow state:", error);
        }
        console.log(`Followed notification with ID: ${followerId}`);
    };

    // Function to categorize notifications by date
    const categorizeNotifications = (notifications) => {
        const now = moment();
        const categorized = {
            today: [],
            yesterday: [],
            lastWeek: [],
            older: [],
        };

        notifications.forEach((notification) => {
            const notificationDate = moment(notification.timestamp);
            if (notificationDate.isSame(now, "day")) {
                categorized.today.push(notification);
            } else if (notificationDate.isSame(now.clone().subtract(1, "day"), "day")) {
                categorized.yesterday.push(notification);
            } else if (notificationDate.isSameOrAfter(now.clone().subtract(7, "days"), "day")) {
                categorized.lastWeek.push(notification);
            } else {
                categorized.older.push(notification);
            }
        });

        return categorized;
    };

    const renderNotificationItem = ({ item }) => (
        <View style={[styles.notificationItem, !item.read && styles.unreadBackground, !item.read && { borderLeftWidth: 5, borderLeftColor: "#4a42c0" }]}>
            {item.avatar && <Image source={{ uri: item.avatar }} style={styles.avatar} />}
            <View style={styles.notificationContent}>
                {item.user && item.message.includes(item.user) ? (
                    <Text style={styles.notificationText} numberOfLines={3}>
                        <Text style={styles.boldText}>{item.user}</Text>
                        {item.message.replace(item.user, "")}
                    </Text>
                ) : (
                    <Text style={[styles.notificationText, item.read ? styles.readText : styles.unreadText]} numberOfLines={3}>
                        {item.message}
                    </Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                {item.notificationType === "follow" && (
                    <TouchableOpacity style={[styles.button, styles.followButton]} onPress={() => handleFollow(item.isFollowing, item.followerId)}>
                        <Text style={styles.buttonText}>{item.isFollowing ? "Following" : "Follow"}</Text>
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

    // const categorizedNotifications = categorizeNotifications(notifications);


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
            paddingTop: 20,
        },
        listContainer: {
            flexGrow: 1,
            marginHorizontal: 5, // Optional: adjust as needed
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12, // Increase margin to separate from text
        },
        notificationItem: {
            flexDirection: "row", // Ensure items are in a row
            alignItems: "flex-start", // Align items at the start of the container
            marginBottom: 16,
            padding: 12,
            paddingVertical: 20,
            borderRadius: 8, // Added border radius for rounded corners
            backgroundColor: isDarkMode ? "#0f0f0f" : "#f0f0f0", // Light gray background for all notifications
        },
        notificationContent: {
            flex: 1, // Take up available space
        },
        notificationText: {
            fontSize: 16,
            color: theme.gray,
            flexWrap: "wrap", // Wrap text if necessary
            color: theme.textColor,
        },
        boldText: {
            fontWeight: "bold",
        },
        readText: {
            color: theme.gray,
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
            padding: 8,
            borderRadius: 4,
            marginLeft: 8,
        },
        followButton: {
            backgroundColor: "#007bff",
        },
        acceptButton: {
            backgroundColor: "#28a745",
        },
        declineButton: {
            backgroundColor: "#dc3545",
        },
        deleteButton: {
            backgroundColor: "#6c757d",
        },
        buttonText: {
            color: "#fff",
            fontWeight: "bold",
        },
        noNotificationsContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 100,
        },
        noNotificationsText: {
            fontSize: 18,
            color: theme.gray,
        },
        sectionHeader: {
            fontSize: 18,
            fontWeight: "bold",
            marginVertical: 10,
            marginLeft: 10,
            color: theme.textColor,
        },
        clearButton: {
            backgroundColor: "#007bff",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            marginVertical: 20,
        },
        divider: {
            height: 1,
            backgroundColor: theme.borderColor,
            marginVertical: 8,
        },
        unreadBorder: {
            borderLeftColor: theme.primaryColor, // Purple color for unread notifications
            borderLeftWidth: 5, // Adjust width as needed
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {notifications.length === 0 ? (
                    <View style={styles.noNotificationsContainer}>
                        <Text style={styles.noNotificationsText}>You have no notifications at the moment</Text>
                    </View>
                ) : (
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {Object.keys(categorizedNotifications).map(
                            (category) =>
                                categorizedNotifications[category].length > 0 && (
                                    <View key={category}>
                                        <Text style={styles.sectionHeader}>{category === "today" ? "Today" : category === "yesterday" ? "Yesterday" : category === "lastWeek" ? "Last Week" : "Older Notifications"}</Text>
                                        <FlatList data={categorizedNotifications[category]} renderItem={renderNotificationItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} />
                                    </View>
                                )
                        )}
                        <TouchableOpacity style={styles.clearButton} onPress={handleClearNotifications}>
                            <Text style={styles.buttonText}>Clear All</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>

            <BottomHeader userInfo={userInfo} />
        </View>
    );
};

export default Notifications;
