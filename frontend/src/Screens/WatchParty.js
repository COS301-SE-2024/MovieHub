import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import InviteModal from "../Components/InviteModal";
import { inviteUserToRoom, addMessageToRoom, getMessagesFromRoom, getRoomDetails, getRoomParticipants } from "../Services/RoomApiService"; // Import functions

const WatchParty = ({ route }) => {
    const { userInfo, roomId } = route.params;
    const navigation = useNavigation();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [roomName, setRoomName] = useState(""); // State to store the room name
    const flatListRef = useRef(null);
    const bottomSheetRef = useRef(null);

    useEffect(() => {
        const fetchParticipantsAndMessages = async () => {
            try {
                // Fetch room participants
                const fetchedParticipants = await getRoomParticipants(roomId);
                setParticipants(fetchedParticipants);
               // console.log("LOOOOOOOOOK", participants);
                // Fetch room details
                const roomDetails = await getRoomDetails(roomId);
                setRoomName(roomDetails.room.roomName || "Unknown Room"); // Set room name

                // Fetch messages
                const fetchedMessages = await getMessagesFromRoom(roomId);
                const formattedMessages = Object.entries(fetchedMessages).map(([key, value]) => {
                    const senderInfo = participants.find(participant => participant.uid === value.userId) || {};
                    return {
                        id: key,
                        sender: value.userId === userInfo.userId ? userInfo.username : senderInfo.username || "Unknown User",
                        avatar: value.userId === userInfo.userId ? null : senderInfo.avatar || "https://i.pravatar.cc/300", // Placeholder avatar for others
                        text: value.message,
                        timestamp: value.timestamp,
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
            await inviteUserToRoom(userInfo.id, friend.id, roomId);
            Alert.alert("Success", `${friend.name} has been invited.`);
        } catch (error) {
            Alert.alert("Error", `Failed to invite ${friend.name}: ${error.message}`);
        }
    };

    const renderMessage = ({ item, index }) => {
        const isUserMessage = item.sender === userInfo.username;
        const previousMessage = index > 0 ? messages[index - 1] : null;

        const showName = !previousMessage || previousMessage.sender !== item.sender;
        const showAvatar = !isUserMessage && (!previousMessage || previousMessage.sender !== item.sender);

        return (
            <View style={[styles.messageContainer, isUserMessage && styles.userMessageContainer]}>
                {showName && <Text style={styles.messageSender}>{item.sender}</Text>}
                <View style={styles.messageRow}>
                    {!isUserMessage && showAvatar && (
                        item.avatar ?
                            (<Image
                                source={{ uri: item.avatar }}
                                style={styles.avatar}
                            />) :
                            (<View style={styles.avatar}>
                                <Text>{item.sender.charAt(0)}</Text>
                            </View>)
                    )}
                    <View
                        style={[
                            styles.message,
                            isUserMessage ? styles.userMessage : styles.otherMessage,
                            !showAvatar && { marginLeft: 48 }, // Indent other user messages
                        ]}
                    >
                        <Text>{item.text}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Interstellar</Text>
            </View>

            <View style={styles.videoPlayer}>
                <Text>Video Player Placeholder</Text>
            </View>

            <View style={styles.roomInfo}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>Room: {roomName}</Text>
                    <View style={styles.roomDetails}>
                        <Ionicons name="people" size={16} color="black" />
                        <Text>{participants.length}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleInvitePress}>
                    <Ionicons name="share-social" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.chatbox}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            />

            <View style={styles.chatInput}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={setMessage}
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity>
                        <Ionicons name="happy" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <InviteModal ref={bottomSheetRef} friends={participants} title="Invite Friends" onInvite={handleInviteUser} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#f1f1f1",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
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
        backgroundColor: "#f9f9f9",
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
        alignItems: "flex-end",
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    message: {
        maxWidth: "70%",
        borderRadius: 16,
        padding: 8,
    },
    userMessage: {
        backgroundColor: "#007bff",
        color: "#fff",
    },
    otherMessage: {
        backgroundColor: "#e1e1e1",
    },
    messageSender: {
        fontWeight: "bold",
    },
    chatInput: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        backgroundColor: "#fff",
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
    },
    input: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
    },
    sendButton: {
        backgroundColor: "#007bff",
        borderRadius: 16,
        padding: 8,
    },
});

export default WatchParty;
