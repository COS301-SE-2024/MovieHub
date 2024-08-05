// WatchParty.js
import React, { useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import InviteModal from "../Components/InviteModal";

const WatchParty = ({ route }) => {
    const {userInfo} = route.params;
    const navigation = useNavigation();
    const [message, setMessage] = useState("");

    const bottomSheetRef = useRef(null);

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
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => navigation.dispatch(e.data.action)
                }
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

            navigation.addListener('beforeRemove', onBeforeRemove);

            return () => navigation.removeListener('beforeRemove', onBeforeRemove);
        }, [navigation])
    );

    // TODO: replace with real data
    const friends = [
        { id: "1", name: "Rebecca Malope" },
        { id: "2", name: "Ant Man" },
        { id: "3", name: "Ryan Reynolds" },
        { id: "4", name: "Kodak Black" },
        { id: "5", name: "Mr Beast" },
        { id: "6", name: "Ant Woman" },
        { id: "7", name: "Captain America" },
    ];

    return (
        <View style={styles.container}>
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

            {/* Invite Friends */}
            <View style={styles.chatbox}>
                <View style={styles.inviteFriends}>
                    <Text>You seem to be the only one in the room</Text>
                    <TouchableOpacity onPress={handleInvitePress}>
                        <Text style={styles.inviteText}>Invite Friends</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chat Input */}
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
            <InviteModal 
                ref={bottomSheetRef} 
                friends={friends} 
                title="Invite Friends" 
                userInfo={userInfo} 
            />
        </View>
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
    inviteFriends: {
        alignItems: "center",
        padding: 16,
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

export default WatchParty;
