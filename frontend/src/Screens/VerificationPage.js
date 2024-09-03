import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { checkEmailVerification } from "../Services/AuthApiService";

const VerificationPage = ({ route }) => {
    const [emailVerified, setEmailVerified] = useState(false);
    const [checking, setChecking] = useState(false);
    const navigation = useNavigation();

    const handleError = () => {
        Alert.alert(
            "Error",
            "Failed to check email verification. Please try to sign in again.",
            [
                {
                    text: "OK",
                    onPress: () => navigation.navigate('Login'), // Navigate to the login page
                },
            ]
        );
    };

    const verifyEmail = async () => {
        setChecking(true);
        try {
            const verified = await checkEmailVerification();
            if (verified) {
                setEmailVerified(true);
                navigation.navigate("ProfileSetup", { route: route.params.route });
            } else {
                alert("Your email is not yet verified. Please check your inbox.");
            }
        } catch (error) {
            console.log("Error checking email verification: " + error.message);
            handleError();
        } finally {
            setChecking(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>MovieHub.</Text>
            <Text style={styles.tagline}>Engage. Share. Discover.</Text>
            <Text style={styles.message}>A verification email has been sent to your email address.</Text>
            <Text style={styles.message}>Please verify your email to proceed.</Text>
            <Pressable style={styles.button}onPress={verifyEmail} disabled={checking}>
                <Text style={{ color: "#fff", textAlign: "center" }}>{checking ? <ActivityIndicator size="small" color="#fff" /> : "I have verified my email"}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
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
    message: {
        fontSize: 18,
        textAlign: "center",
        marginVertical: 10,
    },
    button: {
        backgroundColor: "#4a42c0",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    }
});

export default VerificationPage;
