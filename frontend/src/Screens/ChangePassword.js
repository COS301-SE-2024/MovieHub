import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

export default function ChangePassword() {
    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    const allFieldsFilled = currPassword && newPassword && confirmPassword;

    const handleSave = () => {
        if (!allFieldsFilled) return;

        if (newPassword === confirmPassword) {
            setFeedbackMessage("Your password has been changed successfully.");
            setFeedbackSuccess(true);
            // Clear the input fields
            setCurrPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setFeedbackMessage("Passwords do not match.");
            setFeedbackSuccess(false);
        }
        setFeedbackVisible(true);
        setTimeout(() => {
            setFeedbackVisible(false);
        }, 3000); // Hide feedback after 3 seconds
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput style={styles.inputText} onChangeText={setCurrPassword} value={currPassword} placeholder="" secureTextEntry={true} />
            </View>

            <View style={styles.line} />

            <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput style={styles.inputText} onChangeText={setNewPassword} value={newPassword} placeholder="" secureTextEntry={true} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput style={styles.inputText} onChangeText={setConfirmPassword} value={confirmPassword} placeholder="" secureTextEntry={true} />
            </View>
            <TouchableOpacity onPress={handleSave} style={[styles.saveButton, !allFieldsFilled && styles.saveButtonDisabled]} disabled={!allFieldsFilled}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>

            <View style={{ flex: 0.3 }} />

            {feedbackVisible && (
                <View style={[styles.feedbackContainer, feedbackSuccess ? styles.success : styles.error]}>
                    <Text style={styles.feedback}>{feedbackMessage}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: "#fff",
    },
    inputContainer: {
        paddingLeft: 30,
    },
    label: {
        fontWeight: "bold",
        paddingBottom: 8,
        paddingTop: 20,
    },
    inputText: {
        height: 40,
        width: 300,
        borderColor: "#7b7b7b",
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#000",
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    line: {
        marginTop: 30,
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 5,
        shadowColor: "#e0e0e0",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 10,
        width: 150,
        marginTop: 25,
        marginLeft: 30,
        alignItems: "center",
        opacity: 1,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    forgotPassword: {
        color: "#0f5bd1",
        marginTop: 20,
        marginLeft: 30,
    },
    feedbackContainer: {
        flexShrink: 1,
        flexWrap: "wrap",
        alignSelf: "center",
        display: "flex",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
    },
    feedback: {
        color: "#fff",
    },
    success: {
        backgroundColor: "#31B978",
    },
    error: {
        backgroundColor: "#FF4C4C",
    },
});
