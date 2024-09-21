import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, KeyboardAvoidingView, Platform, Image, PanResponder } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../styles/ThemeContext";
import { inviteUserToRoom, addMessageToRoom, getMessagesFromRoom, getRoomDetails, getRoomParticipants } from "../Services/RoomApiService"; // Import functions
import InviteModal from "../Components/InviteModal";
import moment from "moment";

const WatchParty = ({ route }) => {
    const { userInfo, roomId } = route.params;
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [creator, setCreator] = useState(null);
    const [roomName, setRoomName] = useState("");
    const flatListRef = useRef(null);
    const bottomSheetRef = useRef(null);
    const [visibleTimestamp, setVisibleTimestamp] = useState(null);

    useEffect(() => {
        const fetchParticipantsAndMessages = async () => {
            try {
                // Fetch room participants including creator
                const { participants: fetchedParticipants, creator: fetchedCreator } = await getRoomParticipants(roomId);
                setParticipants(fetchedParticipants);
                setCreator(fetchedCreator);

                // Fetch room details.
                const roomDetails = await getRoomDetails(roomId);
                setRoomName(roomDetails.room.roomName || "Unknown Room"); // Set room name

                // Fetch messages
                const fetchedMessages = await getMessagesFromRoom(roomId);
                const formattedMessages = Object.entries(fetchedMessages).map(([key, value]) => {
                    const senderInfo = fetchedParticipants.find((participant) => participant.uid === value.userId) || fetchedCreator;
                    return {
                        id: key,
                        sender: value.userId === userInfo.userId ? userInfo.username : senderInfo.username || "Unknown User",
                        avatar: value.userId === userInfo.userId ? null : senderInfo.avatar || "https://i.pravatar.cc/300", // Placeholder avatar for others
                        text: value.message,
                        timestamp: moment(value.timestamp).format("YYYY-MM-DD HH:mm:ss"),
                    };
                });

                setMessages(formattedMessages);
            } catch (error) {
                console.error("Failed to fetch participants or messages:", error);
            }
        };

        fetchParticipantsAndMessages();
    }, [roomId, userInfo.userId]);

    const handleSnapPress = useCallback((index) => {
        bottomSheetRef.current?.snapToIndex(index);
    }, []);

    const handleInvitePress = () => {
        bottomSheetRef.current?.present();
    };

    const handleClosePress = () => {
        bottomSheetRef.current?.close();
    };

    const handleBackPress = (e) => {
        Alert.alert(
            "Leaving?",
            "Are you sure you want to leave the party?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => navigation.dispatch(e.data.action),
                },
            ],
            { cancelable: true }
        );
    };

    useFocusEffect(
        useCallback(() => {
            const onBeforeRemove = (e) => {
                e.preventDefault();
                handleBackPress(e);
            };

            navigation.addListener("beforeRemove", onBeforeRemove);

            return () => navigation.removeListener("beforeRemove", onBeforeRemove);
        }, [navigation])
    );

    const sendMessage = async () => {
        if (message.trim() === "") return;

        const newMessage = {
            id: Math.random().toString(),
            sender: userInfo.username,
            text: message.trim(),
            timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        flatListRef.current.scrollToEnd({ animated: true });

        try {
            await addMessageToRoom(roomId, userInfo.userId, message.trim());
        } catch (error) {
            console.error("Failed to send message:", error);
            Alert.alert("Error", "Failed to send message.");
        }
    };

    const handleInviteUser = async (friend) => {
        try {
            await inviteUserToRoom(userInfo.userId, friend.uid, roomId);
            Alert.alert("Success", `${friend.name} has been invited.`);
        } catch (error) {
            Alert.alert("Error", `Failed to invite ${friend.name}: ${error.message}`);
        }
    };

    const formatDateDivider = (timestamp) => {
        const date = moment(timestamp).startOf("day");
        const today = moment().startOf("day");
        const yesterday = moment().subtract(1, "days").startOf("day");

        if (date.isSame(today, "day")) {
            return "Today";
        } else if (date.isSame(yesterday, "day")) {
            return "Yesterday";
        } else {
            return date.format("MMMM D, YYYY");
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        header: {
            backgroundColor: theme.backgroundColor,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-between",
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
        },
        videoPlayer: {
            backgroundColor: "#ddd",
            height: 200,
            justifyContent: "center",
            alignItems: "center",
        },
        roomInfo: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
        },
        roomDetails: {
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
        },
        chatbox: {
            flex: 1,
            paddingHorizontal: 16,
            marginTop: 8,
        },
        chatInput: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: "#ddd",
        },
        inputContainer: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 50,
            paddingHorizontal: 12,
            paddingVertical: 3,
            marginRight: 8,
        },
        input: {
            flex: 1,
            height: 40,
        },
        sendButton: {
            backgroundColor: "#007aff",
            borderRadius: 20,
            padding: 8,
            justifyContent: "center",
            alignItems: "center",
        },
        messageContainer: {
            marginVertical: 4,
        },
        userMessageContainer: {
            alignSelf: "flex-end",
        },
        otherMessageContainer: {
            alignSelf: "flex-start",
        },
        message: {
            padding: 8,
            borderRadius: 16,
            maxWidth: "80%",
        },
        userMessage: {
            backgroundColor: "#CBC3E3",
            alignSelf: "flex-end",
        },
        otherMessage: {
            backgroundColor: theme.backgroundColor,
            alignSelf: "flex-start",
        },
        messageRow: {
            flexDirection: "row",
            alignItems: "center",
        },
        messageSender: {
            fontWeight: "bold",
            marginBottom: 4,
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: 8,
        },
        dateDivider: {
            alignSelf: "center",
            paddingVertical: 4,
            paddingHorizontal: 12,
            backgroundColor: "#eee",
            borderRadius: 12,
            marginVertical: 4,
        },
        dateDividerText: {
            color: theme.borderColor,
        },
        timestamp: {
            fontSize: 12,
            color: "#555",
            marginTop: 4,
            alignSelf: "flex-end",
        },
    });

    const renderMessage = ({ item, index }) => {
        const isUserMessage = item.sender === userInfo.username;
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const showName = !previousMessage || previousMessage.sender !== item.sender;
        const showAvatar = !isUserMessage && (!previousMessage || previousMessage.sender !== item.sender);

        const showDateDivider = !previousMessage || moment(item.timestamp).startOf("day").diff(moment(previousMessage.timestamp).startOf("day"), "days") !== 0;
        // Create PanResponder for swipe gesture
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                // Detect swipe to the right
                if (gestureState.dx > 50) {
                    setVisibleTimestamp(item.id); // Show timestamp for this message
                } else if (gestureState.dx < -50) {
                    setVisibleTimestamp(null); // Hide timestamp if swiped back
                }
            },
            onPanResponderRelease: () => {
                // Optional: you can reset the state here if needed
            },
        });

        return (
            <View {...panResponder.panHandlers}>
                {showDateDivider && (
                    <View style={styles.dateDivider}>
                        <Text style={styles.dateDividerText}>{formatDateDivider(item.timestamp)}</Text>
                    </View>
                )}
                <View style={[styles.messageContainer, isUserMessage ? styles.userMessageContainer : styles.otherMessageContainer]}>
                    {showName && !isUserMessage && <Text style={styles.messageSender}>{item.sender}</Text>}
                    <View style={styles.messageRow}>
                        {showAvatar && <Image source={{ uri: item.avatar }} style={styles.avatar} />}
                        <View style={[styles.message, isUserMessage ? styles.userMessage : styles.otherMessage, !showAvatar && !isUserMessage ? { marginLeft: 48 } : null]}>
                            <Text>{item.text}</Text>
                            {/* Conditionally render the timestamp */}
                            {visibleTimestamp === item.id && <Text style={styles.timestamp}>{moment(item.timestamp).format("h:mm A")}</Text>}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
            <View style={styles.header}>
                <TouchableOpacity style={{ marginRight: 35 }} onPress={() => navigation.goBack()}>
                    <MatIcon name="arrow-left" size={24} color={theme.iconColor} />
                </TouchableOpacity>
                <Text style={styles.title}>Interstellar</Text>
            </View>

            <View style={styles.videoPlayer}>
                <Text>Video Player Placeholder</Text>
            </View>

            <View style={styles.roomInfo}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: theme.iconColor }}>Room: {roomName}</Text>
                    <View style={styles.roomDetails}>
                        <Ionicons name="people" size={16} color={theme.iconColor} />
                        <Text style={{ color: theme.textColor, marginLeft: 4 }}>{(Array.isArray(participants) ? participants.length : 0) + 1}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleInvitePress}>
                    <Ionicons name="share-social" size={24} color={theme.iconColor} />
                </TouchableOpacity>
            </View>

            <FlatList ref={flatListRef} data={messages} renderItem={renderMessage} keyExtractor={(item) => item.id} style={styles.chatbox} onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} />

            <View style={styles.chatInput}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Type a message..." value={message} onChangeText={setMessage} onSubmitEditing={sendMessage} placeholderTextColor={theme.borderColor} />
                    {/* <TouchableOpacity>
                        <Ionicons name="happy" size={24} color="black" />
                    </TouchableOpacity> */}
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <InviteModal
                ref={bottomSheetRef}
                friends={[]} // Pass an empty array if there are no friends to invite
                title="Invite Friends"
                onInvite={handleInviteUser}
                userInfo={userInfo}
            />
        </KeyboardAvoidingView>
    );
};

export default WatchParty;
