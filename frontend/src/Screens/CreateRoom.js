import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Switch, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import { createRoom, fetchRandomImage } from "../Services/RoomApiService"; // Assuming you have service functions to create a room and fetch a random image
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import ModalSelector from "react-native-modal-selector";

const CreateRoomScreen = ({ route }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { userInfo } = route.params;
    const [roomTitle, setRoomTitle] = useState("");
    const [accessLevel, setAccessLevel] = useState("Everyone");
    const [roomType, setRoomType] = useState("Chat-only");
    const [watchParty, setWatchParty] = useState(false);
    const [maxParticipants, setMaxParticipants] = useState("5"); // Default max participants
    const [roomDescription, setRoomDescription] = useState("");
    const [randomImage, setRandomImage] = useState(null);
    const [isTooltipVisible, setTooltipVisibility] = useState(false);
    const keywords = ["art", "city", "neon", "space", "movie", "night", "stars", "sky", "sunset", "sunrise"];

    useEffect(() => {
        fetchImage();
    }, []);

    const accessLevelOptions = [
        { key: 0, label: "Everyone" },
        { key: 1, label: "Invite only" },
        { key: 2, label: "Followers" },
    ];

    const roomTypeOptions = [
        { key: 0, label: "Chat-only" },
        { key: 1, label: "Audio and chat" },
    ];

    const toggleTooltip = () => {
        setTooltipVisibility(!isTooltipVisible);
    };

    const fetchImage = async () => {
        try {
            const keyword = keywords[Math.floor(Math.random() * keywords.length)];
            const image = await fetchRandomImage(keyword);
            setRandomImage(image);
        } catch (error) {
            console.error("Failed to fetch random image:", error);
        }
    };

    const handleCreateRoom = async () => {
        try {
            const newRoom = await createRoom(userInfo.userId, {
                roomName: roomTitle,
                accessLevel,
                maxParticipants,
                roomDescription,
                roomType,
                createdBy: userInfo.userId, // Assuming userInfo contains userId
                coverImage: randomImage, // Set the fetched random image as the cover image
            });

            if (newRoom.message && newRoom.success === false) {
                Alert.alert("Oops!", newRoom.message);
                return;
            }

            if (watchParty) {

                navigation.navigate("CreateWatchParty", { userInfo, roomId: newRoom.roomId, roomShortCode: newRoom.shortCode });
            } else {
                // Navigate to the HubScreen with the new room data
                navigation.navigate("HubScreen", { userInfo, newRoom }); // Should we rather navigate to ViewRooms?
            }
        } catch (error) {
            console.error("Failed to create room:", error);
            Alert.alert("Error", "Failed to create room. Please try again.");
        }
    };

    const isButtonDisabled = roomTitle === "";

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.backgroundColor,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            height: 40,
            color: theme.textColor,
        },
        title: {
            fontSize: 20,
            color: theme.textColor,
        },
        label: {
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 8,
            marginTop: 20,
            color: theme.textColor,
        },
        input: {
            width: "100%",
            padding: 10,
            backgroundColor: theme.inputBackground,
            borderRadius: 5,
            marginBottom: 15,
        },
        pickerContainer: {
            width: "100%",
            borderRadius: 5,
            overflow: "hidden",
            backgroundColor: theme.inputBackground,
            marginBottom: 15,
        },
        modalSelector: {
            width: "100%",
        },
        initValueTextStyle: {
            color: theme.textColor,
            fontSize: 14,
        },
        selectStyle: {
            width: "100%",
            height: 50,
            justifyContent: "center",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: theme.borderColor,
        },
        selectText: {
            color: theme.textColor,
        },
        optionText: {
            fontSize: 16,
            color: theme.textColor,
        },
        optionStyle: {
            backgroundColor: theme.inputBackground,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        optionContainer: {
            backgroundColor: theme.inputBackground,
        },
        cancelStyle: {
            backgroundColor: theme.inputBackground,
            borderTopWidth: 1,
            borderTopColor: theme.borderColor,
        },
        cancelTextStyle: {
            fontSize: 16,
            color: theme.textColor,
            textTransform: "capitalize",
        },
        switchContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
        },
        createButton: {
            width: "100%",
            padding: 15,
            backgroundColor: theme.primaryColor,
            borderRadius: 5,
            alignItems: "center",
        },
        createButtonText: {
            color: "white",
            fontWeight: "bold",
        },
        disabledButton: {
            opacity: 0.75,
        },
        infoIcon: {
            marginLeft: 5,
        },
        tooltip: {
            backgroundColor: "#f9c74f",
            padding: 10,
            borderRadius: 5,
            marginBottom: 15,
        },
        tooltipText: {
            color: "#000",
            fontSize: 12,
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* <View style={styles.header}>
                <TouchableOpacity style={{ marginRight: 35 }} onPress={() => navigation.goBack()}>
                    <MatIcon name="arrow-left" size={24} color={theme.iconColor} />
                </TouchableOpacity>
                <Text style={styles.title}>Create Room</Text>
            </View> */}

                <Text style={styles.label}>Room Name</Text>
                <TextInput style={styles.input} placeholder="Title" value={roomTitle} onChangeText={setRoomTitle} placeholderTextColor={theme.gray} selectionColor={theme.textColor} color={theme.textColor} />

                <Text style={styles.label}>Room Description</Text>
                <TextInput style={styles.input} placeholder="Description" value={roomDescription} onChangeText={setRoomDescription} placeholderTextColor={theme.gray} selectionColor={theme.textColor} color={theme.textColor} />

                <Text style={styles.label}>Max Participants</Text>
                <TextInput style={styles.input} placeholder="" value={maxParticipants} onChangeText={setMaxParticipants} placeholderTextColor={theme.gray} selectionColor={theme.textColor} color={theme.textColor} />

                <Text style={styles.label}>Access Level</Text>
                <View style={styles.pickerContainer}>
                    <ModalSelector data={accessLevelOptions} initValue={accessLevel} onChange={(option) => setAccessLevel(option.label)} style={styles.modalSelector} selectStyle={styles.selectStyle} selectTextStyle={styles.selectText} optionTextStyle={styles.optionText} optionStyle={styles.optionStyle} optionContainerStyle={styles.optionContainer} cancelStyle={styles.cancelStyle} cancelTextStyle={styles.cancelTextStyle} initValueTextStyle={styles.initValueTextStyle} />
                </View>

                <Text style={styles.label}>Room Type</Text>
                <View style={styles.pickerContainer}>
                    <ModalSelector data={roomTypeOptions} initValue={roomType} onChange={(option) => setRoomType(option.label)} style={styles.modalSelector} selectStyle={styles.selectStyle} selectTextStyle={styles.selectText} optionTextStyle={styles.optionText} optionStyle={styles.optionStyle} optionContainerStyle={styles.optionContainer} cancelStyle={styles.cancelStyle} cancelTextStyle={styles.cancelTextStyle} initValueTextStyle={styles.initValueTextStyle} />
                </View>

                <View style={styles.switchContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.label}>Start Watch Party</Text>
                        <TouchableOpacity onPress={toggleTooltip} style={styles.infoIcon}>
                            <Octicons name="question" size={15} color={theme.iconColor} />
                        </TouchableOpacity>
                    </View>
                    <Switch value={watchParty} onValueChange={setWatchParty} trackColor={{ false: "#767577", true: "#2C2A6F" }} thumbColor={watchParty ? "#4A42C0" : "#f4f3f4"} />
                </View>
                {isTooltipVisible && (
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>A watch party lets you and your friends watch the same movie or show together, even if you're in different locations. Make sure you're logged into the platform (e.g., Netflix, Disney+, etc.) to sync the movie and enjoy it in real time with your group</Text>
                    </View>
                )}

                <TouchableOpacity style={[styles.createButton, isButtonDisabled ? styles.disabledButton : null]} onPress={handleCreateRoom} disabled={isButtonDisabled}>
                    <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default CreateRoomScreen;
