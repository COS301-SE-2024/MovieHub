import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { sendPasswordResetEmail } from "../Services/AuthApiService";
import { useTheme } from "../styles/ThemeContext";
import { colors } from "../styles/theme";

const ForgotPasswordPage = () => {
    const { theme } = useTheme();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigation = useNavigation();

    const handlePasswordReset = async () => {
        setError("");
        setSuccessMessage("");

        if (!email) {
            setError("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email address format");
            return;
        }

        try {
            const message = await sendPasswordResetEmail(email);
            console.log("Password reset email sent:", message);
            setSuccessMessage(message.message || "A password reset email has been sent.");
        } catch (error) {
            setError("Failed to send password reset email. Please try again.");
        }
    };

    const styles = StyleSheet.create({
        scrollContainer: {
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 50,
            backgroundColor: theme.backgroundColor,
        },
        container: {
            width: "85%",
            alignItems: "center",
        },
        logo: {
            fontFamily: "Roboto",
            color: theme.textColor,
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 10,
        },
        tagline: {
            color: theme.gray,
            paddingBottom: 20,
        },
        title: {
            fontFamily: "Roboto",
            color: theme.textColor,
            fontSize: 24,
            marginBottom: 30,
        },
        inputGroup: {
            width: 245,
            marginBottom: 20,
        },
        label: {
            fontWeight: "bold",
            paddingBottom: 8,
            color: theme.textColor,
        },
        inputText: {
            height: 40,
            borderColor: theme.gray,
            borderWidth: 1,
            paddingHorizontal: 10,
            fontSize: 16,
            color: "#000",
            backgroundColor: "transparent",
            borderRadius: 5,
        },
        errorText: {
            color: "red",
            marginTop: 10,
            textAlign: "center",
        },
        successText: {
            color: "green",
            marginTop: 10,
            textAlign: "center",
        },
        button: {
            backgroundColor: theme.primaryColor,
            padding: 10,
            borderRadius: 5,
            width: 245,
            alignItems: "center",
            marginVertical: 10,
        },
        buttonText: {
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
        },
        backToLogin: {
            marginTop: 20,
        },
        backToLoginText: {
            color: theme.textColor,
            textAlign: "center",
            textDecorationLine: "underline",
        },
    });

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <Text style={styles.logo}>MovieHub.</Text>
                        <Text style={styles.tagline}>Reset your password</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.inputText}
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholderTextColor={theme.gray} 
                                selectionColor={theme.textColor} color={theme.textColor}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                            <Text style={styles.buttonText}>Reset Password</Text>
                        </TouchableOpacity>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

                        <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.navigate("LoginPage")}>
                            <Text style={styles.backToLoginText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ForgotPasswordPage;
