import React, { useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import InviteModal from "../Components/InviteModal";

const WatchParty = ({ route }) => {
    const { userInfo } = route.params;
    const navigation = useNavigation();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        { id: "1", sender: "Joyce Moshokoa", avatar: "https://i.pravatar.cc/300", text: "Do you know the muffin man?" },
        { id: "2", sender: "Joyce Moshokoa", avatar: "https://i.pravatar.cc/300", text: "The muffin man??" },
        { id: "3", sender: "Joyce Moshokoa", avatar: "https://i.pravatar.cc/300", text: "The muffin man!" },
        { id: "4", sender: userInfo.name, text: "Yes, I know the muffin man." },
        { id: "5", sender: userInfo.name, text: "He lives on Drury Lane." },
        { id: "6", sender: "Joyce Moshokoa", avatar: "https://i.pravatar.cc/300", text: "Oh, I see!" },
    ]);

    const bottomSheetRef = useRef(null);
    const flatListRef = useRef(null);

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

    const sendMessage = () => {
        if (message.trim() === "") return;

        const newMessage = {
            id: Math.random().toString(),
            sender: userInfo.name,
            text: message.trim(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        flatListRef.current.scrollToEnd({ animated: true });

        // TODO: Send messages to backend

    };

    const renderMessage = ({ item, index }) => {
        const isUserMessage = item.sender === userInfo.name;
        const previousMessage = index > 0 ? messages[index - 1] : null;

        // Show name if it's the first message from the user or a different sender
        const showName = !previousMessage || previousMessage.sender !== item.sender;

        // Show avatar only for other user's first message in a sequence
        const showAvatar = !isUserMessage && (!previousMessage || previousMessage.sender !== item.sender);

        return (
            <View style={[styles.messageContainer, isUserMessage && styles.userMessageContainer]}>
                {showName && (
                    <Text style={styles.messageSender}>{item.sender}</Text>
                )}
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
                {/* <TouchableOpacity>
                    <Ionicons name="settings" size={24} color="black" />
                </TouchableOpacity> */}
            </View>

            <View style={styles.videoPlayer}>
                <Text>Video Player Placeholder</Text>
            </View>

            {/* Room Info */}
            <View style={styles.roomInfo}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>Asa's room</Text>
                    <View style={styles.roomDetails}>
                        <Ionicons name="people" size={16} color="black" />
                        <Text>1</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleInvitePress}>
                    <Ionicons name="share-social" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Chatbox with messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.chatbox}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            />

            {/* Chat Input */}
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
            <InviteModal ref={bottomSheetRef} friends={messages} title="Invite Friends" userInfo={userInfo} />
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
        fontSize: 12,
        color: "#7b7b7b",
        alignSelf: "flex-start",
        fontWeight: "600",
    },
    chatInput: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#f1f1f1",
        alignSelf: "flex-end", // Align chat input to the bottom
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#f1f1f1",
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        height: 40,
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: "#007bff",
        borderRadius: 20,
        padding: 10,
    },
});

export default WatchParty;