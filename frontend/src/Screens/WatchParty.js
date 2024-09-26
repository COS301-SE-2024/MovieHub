import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, KeyboardAvoidingView, Platform, Image, PanResponder } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../styles/ThemeContext";
import { inviteUserToRoom, addMessageToRoom, getMessagesFromRoom, getRoomDetails, getRoomParticipants } from "../Services/RoomApiService"; // Import functions
import InviteModal from "../Components/InviteModal";
import moment from "moment";

const WatchParty = ({ route }) => {
    const { userInfo, roomId, isRoomCreator } = route.params;
    const { theme, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [creator, setCreator] = useState(null);
    const [roomName, setRoomName] = useState("");
    const flatListRef = useRef(null);
    const bottomSheetRef = useRef(null);
    const [visibleTimestamp, setVisibleTimestamp] = useState(null);
    const [watchPartyStarted, setWatchPartyStarted] = useState(false);
    const [loading, setLoading] = useState(true);
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

    // useLayoutEffect(() => {
    //     if (loading) {
    //       navigation.setOptions({
    //         title: "Loading..."
    //       });
    //     } else if (roomDetails) {
    //       navigation.setOptions({
    //         title: roomDetails.roomName
    //       });
    //     }
    //   }, [navigation, loading, roomDetails]);

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
            position: "relative",
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            backgroundColor: isDarkMode ? theme.backgroundColor : "#f1f1f1",
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
        },
        videoPlayer: {
            height: 200,
            backgroundColor: "#d3d3d3",
            justifyContent: "center",
            alignItems: "center",
        },
        roomInfo: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            backgroundColor: isDarkMode ? theme.borderColor : "#f9f9f9",
        },
        roomDetails: {
            marginLeft: 8,
            flexDirection: "row",
            alignItems: "center",
        },
        chatbox: {
            flex: 1, // Make chatbox take up the remaining space
        },
        messageContainer: {
            marginVertical: 4,
            paddingHorizontal: 14,
        },
        userMessageContainer: {
            alignItems: "flex-end", // Align the user's messages to the right
        },
        messageRow: {
            flexDirection: "row",
            alignItems: "flex-start",
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#d3d3d3",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
        },
        message: {
            padding: 12,
            borderRadius: 20,
            maxWidth: "70%",
        },
        userMessage: {
            backgroundColor: "#d1e7ff",
            alignSelf: "flex-end",
        },
        otherMessage: {
            backgroundColor: "#e0e0e0",
            alignSelf: "flex-start",
        },
        messageSender: {
            marginBottom: 4,
            fontSize: 13,
            color: theme.gray,
            alignSelf: "flex-start",
            fontWeight: "600",
        },
        chatInput: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: theme.borderColor,
            alignSelf: "flex-end", // Align chat input to the bottom
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            backgroundColor: isDarkMode ? theme.inputBackground : "#f1f1f1",
            borderRadius: 20,
            paddingHorizontal: 16,
        },
        input: {
            flex: 1,
            height: 40,
        },
        sendButton: {
            marginLeft: 8,
            backgroundColor: theme.primaryColor,
            borderRadius: 20,
            padding: 10,
        },
        dateDivider: {
            alignSelf: "center",
            paddingVertical: 4,
            paddingHorizontal: 12,
            backgroundColor: theme.primaryColor,
            borderRadius: 12,
            marginVertical: 4,
            marginTop: 10,
        },
        dateDividerText: {
            color: "white",
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
            {/* <View style={styles.header}>
                <TouchableOpacity style={{ marginRight: 35 }} onPress={() => navigation.goBack()}>
                    <MatIcon name="arrow-left" size={24} color={theme.iconColor} />
                </TouchableOpacity>
                {watchPartyStarted && <Text style={styles.title}>Interstellar</Text>}
            </View>
                <Text style={styles.title}>Interstellar</Text>
            </View> */}


            {watchPartyStarted && (
                <View style={styles.videoPlayer}>
                    <Text>Video Player Placeholder</Text>
                </View>
            )}

            <View style={styles.roomInfo}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: theme.iconColor }}>Room: {roomName}</Text>
                    <View style={styles.roomDetails}>
                        <TouchableOpacity onPress={() => navigation.navigate("ViewParticipants", { userInfo, isRoomCreator, roomId: route.params.roomId})}>
                            <Ionicons name="people" size={16} color={theme.iconColor} onPress={() => navigation.navigate("ViewParticipants", { userInfo, isRoomCreator, roomId: route.params.roomId})}/>
                        </TouchableOpacity>
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
                    <TextInput style={styles.input} placeholder="Type a message..." value={message} onChangeText={setMessage} onSubmitEditing={sendMessage} placeholderTextColor={theme.gray} selectionColor={theme.textColor} color={theme.textColor} />
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
                roomId={roomId}
            />
        </KeyboardAvoidingView>
    );
};

export default WatchParty;
