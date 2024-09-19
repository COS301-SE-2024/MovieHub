import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Pressable, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import google from "../../../assets/googles.png";
import facebook from "../../../assets/facebook.png";
import twitter from "../../../assets/apple-logo.png";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { isUserVerified, loginUser } from "../Services/AuthApiService";
import * as SecureStore from "expo-secure-store";
import { colors } from "../styles/theme";
import { getUserProfile } from "../Services/UsersApiService";
import logo2 from "../../../assets/logo.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const navigation = useNavigation();

    const handleNewUser = () => {
        navigation.navigate("SignupPage");
    };

    const HandleLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email address format");
            return;
        }

        try {
            const data = await loginUser(email, password);
            await SecureStore.setItemAsync("userToken", data.data.token);

            const userInfo = {
                userId: data.data.uid,
                username: data.data.username,
            };

            const userData = await getUserProfile(userInfo.userId);

            const verified = await isUserVerified();

            if (!verified) {
                navigation.navigate("VerificationPage", { userInfo });
            } else if (!userData.name) {
                navigation.navigate("ProfileSetup", { userInfo });
            } else {
                // prevents the user from going back to the login page
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Home", params: { userInfo } }], // Replace 'Home' with your home screen name
                    })
                );
                navigation.navigate("Home", { userInfo });
            }
        } catch (error) {
            console.log("Error", error);

            let errorMessage = "Error signing in";
            const firebaseErrorMessage = error.message;

            if (firebaseErrorMessage.includes("auth/invalid-login-credentials")) {
                errorMessage = "Incorrect email or password. Please try again.";
            } else if (firebaseErrorMessage.includes("auth/wrong-password")) {
                errorMessage = "Incorrect password. Please try again";
            } else if (firebaseErrorMessage.includes("auth/invalid-email")) {
                errorMessage = "Invalid email address format";
            } else if (firebaseErrorMessage.includes("auth/invalid-login-credentials")) {
                errorMessage = "Incorrect email or password. Please try again";
            } else if (firebaseErrorMessage.includes("auth/too-many-requests")) {
                errorMessage = "Too many failed login attempts. Please try again later.";
            } else if (!email || !password) {
                errorMessage = "Email and password are required";
            } else {
                errorMessage = error.message; // Default to Firebase's error message
            }
            // console.error("Error signing in:", error);
            setError(errorMessage);
        }
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
        title: {
            fontFamily: "Roboto",
            color: "#000000",
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
        passwordInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#7b7b7b",
            borderWidth: 1,
            height: 40,
            borderRadius: 5,
            paddingHorizontal: 10,
        },
        passwordInput: {
            flex: 1,
        },
        passwordVisibilityButton: {
            padding: 5,
        },
        errorText: {
            color: "red",
            marginTop: 10,
            textAlign: "center",
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
        forgot: {
            marginTop: 10,
        },
        forgotText: {
            color: "black",
            textAlign: "center",
            textDecorationLine: "underline",
        },
        orContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 30,
            marginHorizontal: 40,
        },
        line: {
            flex: 1,
            height: 1,
            backgroundColor: "#7b7b7b",
        },
        orText: {
            marginHorizontal: 10,
            fontSize: 15,
            color: "#7b7b7b",
        },
        logoImage: {
            width: 200,
            height: 100,
            alignSelf: 'center',
            resizeMode: 'contain',
        },
        socialContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: "60%",
            marginBottom: 30,
        },
        socialLink: {
            height: 35,
            width: 35,
            resizeMode: "contain",
        },
        signupLink: {
            flexDirection: "row",
            alignItems: "center",
        },
        signupText: {
            // fontSize: 16,
            color: colors.primary,
            fontWeight: "500",
        },
        link: {
            textDecorationLine: "underline",
            color: colors.primary,
        },
    });

    return (
        <View style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                    <Image source={logo2} style={styles.logoImage} />
                    {/* <Text style={styles.logo}>MovieHub.</Text> */}
                        {/* <Text style={styles.tagline}>Engage. Share. Discover.</Text> */}
                        <Text style={styles.title}>Welcome Back!</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput style={styles.inputText} onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput style={styles.passwordInput} onChangeText={setPassword} value={password} secureTextEntry={!isPasswordVisible} autoCapitalize="none" autoCorrect={false} />
                                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityButton}>
                                    <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Pressable style={styles.button} onPress={HandleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            style={styles.forgot}
                            onPress={() => {
                                navigation.navigate("ForgotPasswordPage");
                            }}>
                            <Text style={styles.forgotText}>Forgot password?</Text>
                        </TouchableOpacity>

                        <View style={styles.orContainer}>
                            <View style={styles.line} />
                            <Text style={styles.orText}>Or</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.socialContainer}>
                            <TouchableOpacity>
                                <Image style={styles.socialLink} source={google} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image style={styles.socialLink} source={facebook} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image style={styles.socialLink} source={twitter} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.signupLink}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={handleNewUser}>
                                <Text style={styles.link}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default LoginPage;
