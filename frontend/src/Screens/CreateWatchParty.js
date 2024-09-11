import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NetflixLogo from "../../../assets/netflix-logo.svg";
import ShowmaxLogo from "../../../assets/showmax-logo.svg";
import AppleTVLogo from "../../../assets/apple-tv.svg";
import { createWatchParty } from "../Services/PartyApiService";

const platformLogos = {
    Netflix: NetflixLogo,
    Showmax: ShowmaxLogo,
    "Apple TV": AppleTVLogo,
};

const CreateWatchParty = ({ route }) => {
    const { userInfo, roomId } = route.params; // Get the userInfo passed from the previous screen
    const userId = userInfo?.userId; // Assuming userInfo contains the user's ID
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [partyTitle, setPartyTitle] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [isTooltipVisible, setTooltipVisibility] = useState(false);
    const isButtonDisabled = partyTitle === "" || selectedPlatform === "" || selectedDate === "";

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date.toISOString());
        hideDatePicker();
    };

    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
    };

    const handleCreateParty = async () => {
        try {
            const createdAt = new Date().toISOString(); // Set current time as `createdAt`
            console.log("Check streaming Plat: " + selectedPlatform);
            const response = await createWatchParty(userId, roomId, {
                partyName: partyTitle,
                startTime: selectedDate,
                streamingPlatform: selectedPlatform,
                 createdBy: userId, // Use the userId from userInfo
                // createdAt: createdAt,
            });

            console.log("Here's the response:", response);
            if (response) {
                Alert.alert("Success", "Watch party created successfully!");
                // Navigate to the watch party or another screen as needed
            } else {
                Alert.alert("Error", "Failed to create watch party. Please try again.");
            }
        } catch (error) {
            console.error("Error creating watch party:", error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        }
    };

    const toggleTooltip = () => {
        setTooltipVisibility(!isTooltipVisible);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Watch Party Name</Text>
            <TextInput style={styles.input} placeholder="Enter party name" value={partyTitle} onChangeText={setPartyTitle} />

            <Text style={styles.label}>Party Date and Time</Text>
            <TouchableOpacity onPress={showDatePicker} style={[styles.dateInput]}>
                <Text style={{ color: "#7b7b7b" }}>{selectedDate ? new Date(selectedDate).toLocaleString() : "Select a Date and Time"}</Text>
            </TouchableOpacity>
            <DateTimePickerModal isVisible={isDatePickerVisible} mode="datetime" onConfirm={handleConfirm} onCancel={hideDatePicker} />

            <View style={styles.platformLabelContainer}>
                <Text style={styles.label}>Select A Platform</Text>
                <TouchableOpacity onPress={toggleTooltip} style={styles.infoIcon}>
                    <Octicons name="question" width={30} height={30} />
                </TouchableOpacity>
            </View>
            {isTooltipVisible && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>You need to log into the selected platform to watch the movie.</Text>
                </View>
            )}
            <View style={{ marginBottom: 10 }}>
                {Object.keys(platformLogos).map((platform) => {
                    const PlatformLogo = platformLogos[platform];
                    const isSelected = selectedPlatform === platform;
                    return (
                        <TouchableOpacity key={platform} onPress={() => handlePlatformSelect(platform)} style={[styles.platformContainer, isSelected && styles.selectedPlatform]}>
                            <PlatformLogo width={40} height={40} style={{ marginRight: 10 }} />
                            <Text>{platform}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity style={[styles.createButton, isButtonDisabled ? styles.disabledButton : null]} onPress={handleCreateParty} disabled={isButtonDisabled}>
                <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 12,
        marginTop: 20,
    },
    platformLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        width: "100%",
        padding: 10,
        backgroundColor: "#D9D9D9",
        borderRadius: 5,
        marginBottom: 15,
    },
    dateInput: {
        width: "100%",
        padding: 10,
        paddingVertical: 12,
        backgroundColor: "#D9D9D9",
        borderRadius: 5,
        marginBottom: 15,
    },
    platformContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    selectedPlatform: {
        borderColor: "#4A42C0",
        borderWidth: 1,
    },
    createButton: {
        width: "100%",
        padding: 15,
        backgroundColor: "#4a42c0",
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
        marginVertical: 5,
        marginBottom: 15,
    },
    tooltipText: {
        color: "#000",
        fontSize: 12,
    },
});

export default CreateWatchParty;
