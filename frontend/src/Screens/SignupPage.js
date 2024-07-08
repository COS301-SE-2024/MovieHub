import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Pressable } from "react-native";
import google from "../../../assets/googles.png";
import facebook from "../../../assets/facebook.png";
import twitter from "../../../assets/apple-logo.png";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import FAIcon from "@expo/vector-icons/FontAwesome5";
//import { signUp } from "../../../backend/src/services/authService";
import { registerUser } from "../Services/AuthApiService";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native";
import { colors } from "../styles/theme";

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [isLoadingUsername, setIsLoadingUsername] = useState(false);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 2000);
            return () => clearTimeout(timer);
        }
        getRandomName();
    }, [error]);

    // get username from random name generator api

    const getRandomName = async () => {
        setIsLoadingUsername(true);
        try {
            const response = await fetch("https://usernameapiv1.vercel.app/api/random-usernames");
            const data = await response.json();
            const name = data.usernames[0];
            setUsername(name);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingUsername(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const navigation = useNavigation();

    const handleExistingUser = () => {
        navigation.navigate("LoginPage"); ///Change back to LoginPage
    };

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (username.length < 3) {
            setError("Username must be at least 3 characters long");
            return;
        }
        console.log("This is the username ", username);
        try {
            //  await signUp(email, password, username);
            const data = await registerUser(email, password, username);
            console.log("User Registering???");
            await SecureStore.setItemAsync("userToken", data.data.token);
            setError("");
            console.log("User signed up successfully");
            //navigate to the home page with the users info
            const userInfo = {
                userId: data.data.uid,
                username: data.data.username,
                //???     token : data.data.token
            };
            navigation.navigate("HomePage", { userInfo });
        } catch (error) {
            let errorMessage = "Error signing up";
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "Email address is already in use";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address format";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "Password should be at least 6 characters long";
            } else {
                errorMessage = error.message; // Default to Firebase's error message
            }
            // console.error("Error signing up:", error);
            setError(errorMessage);
        }
    };

    const styles = StyleSheet.create({
        title: {
            textAlign: "center",
            fontFamily: "Roboto",
            color: "#000000",
            fontSize: 25,
            fontWeight: "bold",
            paddingBottom: 15,
        },
        logo: {
            textAlign: "center",
            fontFamily: "Roboto",
            color: "#000000",
            fontSize: 20,
            fontWeight: "bold",
        },
        newUsernameButton: {
            marginLeft: 8,
        },
        inputText: {
            height: 40,
            width: 250,
            borderColor: "#7b7b7b",
            borderWidth: 1,
            paddingHorizontal: 10,
            fontSize: 16,
            color: "#000",
            backgroundColor: "#fff",
            borderRadius: 5,
        },
        socialContainer: {
            flexDirection: "row",
            marginTop: 10,
            marginBottom: 10,
        },
        socialLink: {
            marginHorizontal: 20,
            height: 40,
            width: 40,
        },
        container: {
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            backgroundColor: "#ffffff",
            paddingVertical: 100,
        },
        or: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
        },
        line: {
            marginHorizontal: 15,
            height: 1,
            width: "25%",
            backgroundColor: "#7b7b7b",
            marginVertical: 20,
        },
        label: {
            fontWeight: "bold",
            paddingBottom: 8,
            paddingTop: 20,
        },
        forgot: {
            alignItems: "flex-start",
        },
        btn: {
            width: 250,
        },
        button: {
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 5,
            width: 250,
            marginTop: 25,
        },
        buttonText: {
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
        },
        link: {
            fontSize: 15,
            textDecorationLine: "underline",
            color: "#0f5bd1",
        },
        signupLink: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        input: {
            marginBottom: 10,
        },
        passwordInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#7b7b7b",
            borderWidth: 1,
            height: 40,
            width: 250,
            borderRadius: 5,
        },
        passwordInput: {
            flex: 1,
            margin: 10,
            fontSize: 16,
        },
        passwordVisibilityButton: {
            margin: 10,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>movieHub.</Text>
            <Text style={styles.title}>Create Account</Text>
            <View style={{ paddingLeft: 27 }}>
                <Text style={styles.label}>Username</Text>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <TextInput style={styles.inputText} onChangeText={setUsername} value={username} placeholder="" />
                    <TouchableOpacity style={styles.newUsernameButton} onPress={getRandomName} disabled={isLoadingUsername}>
                        {isLoadingUsername ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <FAIcon name="redo" size={20} color="black" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.inputText} onChangeText={setEmail} keyboardType="email-address" value={email} placeholder="" />
            </View>
            <View>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordInputContainer}>
                    <TextInput style={[styles.input, styles.passwordInput]} placeholder="" onChangeText={setPassword} value={password} secureTextEntry={!isPasswordVisible} />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityButton}>
                        <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordInputContainer}>
                    <TextInput style={[styles.input, styles.passwordInput]} placeholder="" onChangeText={setConfirmPassword} value={confirmPassword} secureTextEntry={!isConfirmPasswordVisible} />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.passwordVisibilityButton}>
                        <Icon name={isConfirmPasswordVisible ? "visibility" : "visibility-off"} size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.btn}>
                <Pressable style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
                {error ? <Text style={{ color: "red", marginTop: 10, textAlign: "center" }}>{error}</Text> : null}
            </View>
            <View style={styles.or}>
                <View style={styles.line} />
                <Text style={{ fontSize: 15, color: "#7b7b7b" }}>Or</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.socialContainer}>
                <Image style={styles.socialLink} source={google} />
                <Image style={styles.socialLink} source={facebook} />
                <Image style={styles.socialLink} source={twitter} />
            </View>
            <View style={styles.signupLink}>
                <Text style={{ fontSize: 16 }}>Already have an account? </Text>
                <TouchableOpacity onPress={handleExistingUser}>
                    <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};



export default SignupPage;
