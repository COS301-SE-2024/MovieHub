import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import { updateUserPassword } from "../Services/AuthApiService";

export default function ChangePassword({ route }) {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const allFieldsFilled = currPassword && newPassword && confirmPassword;

    const getErrorMessage = (error) => {
        
        if (error.includes('auth/invalid-email')) {
            return "The email address is badly formatted.";
        } else if (error.includes('auth/wrong-password')) {
            return "The password is incorrect.";
        } else if (error.includes('auth/user-not-found')) {
            return "There is no user corresponding to this email.";
        } else if (error.includes('auth/weak-password')) {
            return "The password is too weak.";
        } else if (error.includes('auth/invalid-login-credentials')) {
            return "Invalid login credentials. Please try again.";
        } else if (error.includes('auth/too-many-requests')) {
            return "Too many requests. Please try again later.";
        }
        
        return error ? error : "An error occurred. Please try again.";
    };
    
    
    const handleSave = async () => {
        if (!allFieldsFilled) return;

        if (newPassword !== confirmPassword) {
            setPasswordMismatch(true);
            Alert.alert("Passwords do not match", "Please enter the same password in both fields.");
            return;
        }

        try {
            const result = await updateUserPassword(currPassword, newPassword);
            console.log("Result update password:", result);
            if (result.success) {
                Alert.alert("Success", result.message);
                setCurrPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordMismatch(false);
            } else {
                console.log("Error:", result.error);
                const errorMessage = getErrorMessage(result.error);
                Alert.alert("Error", errorMessage);
            }
        } catch (error) {
            console.log("Error:", error);
            const errorMessage = getErrorMessage(error);
            Alert.alert("Error", errorMessage);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        scrollContainer: {
            paddingTop: 10,
        },
        passwordRequirements: {
            paddingHorizontal: 28,
            color: theme.gray,
        },
        inputContainer: {
            paddingLeft: 30,
        },
        label: {
            fontWeight: "bold",
            paddingBottom: 8,
            paddingTop: 20,
            color: theme.textColor,
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
        inputError: {
            borderColor: theme.borderColor,
        },
        line: {
            // marginTop: 30,
            height: 1,
            backgroundColor: "transparent",
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
            alignSelf: "center",
            backgroundColor: theme.primaryColor,
            padding: 12,
            borderRadius: 10,
            width: "100%",
            marginTop: 25,
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
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.passwordRequirements}>
                    Your password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and a special character.
                </Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                        style={[styles.inputText, { borderColor: '#7b7b7b' }]}
                        onChangeText={setCurrPassword}
                        value={currPassword}
                        placeholder=""
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity onPress={() => {navigation.navigate('ForgotPassword');}}>
                    <Text style={styles.forgotPassword}>Forgot your password?</Text>
                </TouchableOpacity>

                <View style={styles.line} />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={[styles.inputText, passwordMismatch ? styles.inputError : { borderColor: '#7b7b7b' }]}
                        onChangeText={setNewPassword}
                        value={newPassword}
                        placeholder=""
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={[styles.inputText, passwordMismatch ? styles.inputError : { borderColor: '#7b7b7b' }]}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        placeholder=""
                        secureTextEntry={true}
                    />
                </View>
                
                <View style={{ flex: 0.8 }} />
                <View style={{ paddingHorizontal: 16 }}>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.saveButton, !allFieldsFilled && styles.saveButtonDisabled]}
                        disabled={!allFieldsFilled}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


