// Chatbox.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWebSocket } from '../context/WebSocketProvider'; // Ensure you have this setup as per previous instructions

const Chatbox = ({ userInfo, handleInvitePress }) => {
    const socket = useWebSocket();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, data]);
            };
        }

        return () => {
            if (socket) {
                socket.onmessage = null;
            }
        };
    }, [socket]);

    const sendMessage = () => {
        if (socket && message.trim()) {
            const msg = {
                username: userInfo.username,
                avatar: userInfo.avatar,
                text: message,
                timestamp: new Date().toISOString(),
            };
            socket.send(JSON.stringify(msg));
            setMessage('');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.message}>
            <Text style={styles.username}>{item.username}</Text>
            <Text>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.chatbox}>
            {messages.length !== 0 ? (
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                /> 
            ) : (
                <>
                    <View style={styles.chatbox}>
                        <View style={styles.inviteFriends}>
                            <Text>You seem to be the only one in the room</Text>
                            <TouchableOpacity onPress={handleInvitePress}>
                                <Text style={styles.inviteText}>Invite Friends</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.chatInput}>
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} placeholder="Type a message..." value={message} onChangeText={setMessage} />
                            <TouchableOpacity>
                                <Ionicons name="happy" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.sendButton}>
                            <Ionicons name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    chatbox: {
        flex: 1,
        flexGrow: 1
    },
    message: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    username: {
        fontWeight: 'bold',
    },
    inviteFriends: {
        alignItems: "center",
        // margin: 16,
        justifyContent: "center", // Center content vertically
        height: "100%",
    },
    inviteText: {
        color: "blue",
        fontWeight: "bold",
        fontSize: 16
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
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 40,
    },
    sendButton: {
        backgroundColor: "blue",
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
    },
});

export default Chatbox;
