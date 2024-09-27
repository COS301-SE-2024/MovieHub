import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../styles/ThemeContext";

const CreateWatchParty = ({ route }) => {
    const { theme } = useTheme();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [partyTitle, setPartyTitle] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [isTooltipVisible, setTooltipVisibility] = useState(false);
    const isButtonDisabled = partyTitle === "" || selectedPlatform === "" || selectedDate === "";
    const { roomShortCode } = route.params || {};

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            paddingBottom: 40,
            backgroundColor: theme.backgroundColor,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            color: theme.textColor,
        },
        welcomeMessage: {
            fontSize: 16,
            marginBottom: 20,
            color: theme.textColor,
        },
        label: {
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 12,
            marginTop: 20,
            color: theme.textColor,
        },
        instructions: {
            marginTop: 20,
            color: theme.textColor,
            fontSize: 16,
            lineHeight: 24,
        },
        button: {
            backgroundColor: theme.primaryColor,
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
            marginTop: 20,
        },
        buttonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
        },
        shortCodeContainer: {
            backgroundColor: theme.gray,
            borderRadius: 5,
            padding: 10,
            paddingVertical: 15
        },
        shortCode: {
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
        },
    });

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Create a Watch Party</Text>
            <Text style={styles.welcomeMessage}>Watch parties are a great way to get together with friends and family. </Text>
            {/* Party Title */}

            {/* Instructions for Watch Party */}
            <Text style={styles.instructions}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>Guide to Start a Watch Party:</Text>
                {"\n\n"}
                1. Install the Watch Party extension on your laptop or PC's browser (e.g Chrome, Firefox).
                {"\n"}
                2. To create a party, copy the room short code provided on this page and use it in the extension.
                {"\n"}
            </Text>
            <View style={styles.shortCodeContainer}>
                <Text style={styles.shortCode}>{roomShortCode}</Text>
            </View>
            <Text style={styles.instructions}>
                3. A code will be generated for you. You can share the code with your friends and family.
                {"\n"}
                4. Log into your Netflix account to watch with others. All participants must log in to their accounts as well.
                {"\n"}
                5. You can chat via audio, video, and text chat during the watch party.
                {"\n"}
                6. Invite up to 4 other friends to join your watch party!
                {"\n\n"}
                If your watch party is successful, you will be notified here.
            </Text>
        </ScrollView>
    );
};

export default CreateWatchParty;
