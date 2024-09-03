import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { resetPassword } from "../Services/AuthApiService";
import { colors } from "../styles/theme";

const ResetPasswordPage = ({route}) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigation = useNavigation();

    const handleResetPassword = async () => {
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
            await resetPassword(email);
            setSuccessMessage("A password reset email has been sent to your email address.");
        } catch (error) {
            setError("Failed to send password reset email. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <Text style={styles.logo}>MovieHub.</Text>
                        <Text style={styles.tagline}>Reset Your Password</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.inputText}
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <Pressable style={styles.button} onPress={handleResetPassword}>
                            <Text style={styles.buttonText}>Reset Password</Text>
                        </Pressable>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

                        <TouchableOpacity
                            style={styles.backToLogin}
                            onPress={() => navigation.navigate("LoginPage")}
                        >
                            <Text style={styles.backToLoginText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
        backgroundColor: "#ffffff",
    },
    container: {
        width: "85%",
        alignItems: "center",
    },
    logo: {
        fontFamily: "Roboto",
        color: "#000000",
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
    },
    tagline: {
        color: "#7b7b7b",
        paddingBottom: 20,
    },
    inputGroup: {
        width: 245,
        marginBottom: 20,
    },
    label: {
        fontWeight: "bold",
        paddingBottom: 8,
    },
    inputText: {
        height: 40,
        borderColor: "#7b7b7b",
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#000",
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    button: {
        backgroundColor: colors.primary,
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
    backToLogin: {
        marginTop: 20,
    },
    backToLoginText: {
        color: colors.primary,
        textAlign: "center",
        textDecorationLine: "underline",
    },
});

export default ResetPasswordPage;
