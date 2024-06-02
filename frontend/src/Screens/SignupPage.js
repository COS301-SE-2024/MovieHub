import React, { useState } from "react";
import { StyleSheet, Button, Text, TextInput, View, Image, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import google from "../../../assets/googles.png";
import facebook from "../../../assets/facebook.png";
import twitter from "../../../assets/apple-logo.png";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { signUp } from "../../../backend/src/services/authService";

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const navigation = useNavigation();

    const handleExistingUser = () => {
        navigation.navigate("LoginPage");
    };

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await signUp(email, password, username);
            setError("");
            console.log("User signed up successfully");
            navigation.navigate("HomePage");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
                <View style={styles.container}>
                    <Text style={styles.title}>Create Account</Text>
                    <View>
                        <Text style={styles.label}>Username</Text>
                        <TextInput style={styles.inputText} onChangeText={setUsername} value={username} placeholder="" />
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
                        {error ? <Text>{error}</Text> : null}
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

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    title: {
        textAlign: "center",
        fontFamily: "Roboto",
        color: "#000000",
        fontSize: 25,
        fontWeight: "bold",
        paddingBottom: 15,
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
    justforyou: {
        paddingTop: 3,
        textAlign: "center",
        fontFamily: "Roboto",
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
    },

    trending: {
        paddingLeft: 10,
        paddingTop: 20,
        fontFamily: "Roboto",
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
    },

    viewall: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 10,
        backgroundColor: "#fffff",
    },

    viewalltext: {
        paddingTop: 25,
        fontFamily: "Roboto",
    },
    or: {
        flexDirection: "row",
        alignItems: "center",
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
    },
    forgot: {
        alignItems: "flex-start",
    },
    btn: {
        width: 250,
    },
    button: {
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 5,
        width: 250,
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
    }

});

export default SignupPage;

// import React, { useState } from 'react';
// import { StyleSheet, Button, Text, TextInput, View, Image} from 'react-native';
// import google from '../../../assets/google.png';
// import facebook from '../../../assets/facebook.png';
// import twitter from '../../../assets/twitter.png';

// const SignupPage = () => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Create Account</Text>
//             <View>
//                 <Text style={styles.label}>Username</Text>
//                 <TextInput
//                     style={styles.inputText}
//                     onChangeText={setUsername}
//                     value=''
//                     placeholder='Userrname'
//                 />
//             </View>
//             <View>
//                 <Text style={styles.label}>Email</Text>
//                 <TextInput
//                     style={styles.inputText}
//                     onChangeText={setEmail}
//                     value=''
//                     placeholder='Email'
//                 />
//             </View>
//             <View>
//                 <Text style={styles.label}>Password</Text>
//                 <TextInput
//                     style={styles.inputText}
//                     onChangeText={setPassword}
//                     value=''
//                     placeholder='Password'
//                     secureTextEntry={true}
//                 />
//             </View>
//             <View>
//                 <Text style={styles.label}>Confirm Password</Text>
//                 <TextInput
//                     style={styles.inputText}
//                     onChangeText={setConfirmPassword}
//                     value=''
//                     placeholder='Confirm Password'
//                     secureTextEntry={true}
//                 />
//             </View>
//             <Button
//                 title='Sign Up'
//                 color='#000000'
//                 paddingHorizontal='50'
//             />
//             <View style={styles.or}>
//                 <View style={styles.line}/>
//                 <Text style={{fontSize:17}}>Or</Text>
//                 <View style={styles.line}/>
//             </View>
//             <View style={styles.socialContainer}>
//                 <Image style={styles.socialLink} source={google}/>
//                 <Image style={styles.socialLink} source={facebook}/>
//                 <Image style={styles.socialLink} source={twitter}/>
//             </View>
//             <View style={styles.signupLink}>
//                 <Text style={{fontSize:17}}>Already have an account? </Text>
//                 <Text style={styles.link}>Login</Text>
//             </View>
//         </View>
//     )
// };

// const styles = StyleSheet.create({
//     title: {
//         textAlign: 'center',
//         fontFamily: 'Roboto',
//         color: '#000000',
//         fontSize: 25,
//         fontWeight: 'bold',
//     },
//     inputText: {
//         height: 30,
//         width: 250,
//         borderColor: '#000',
//         borderWidth: 1,
//         paddingHorizontal: 10,
//         fontSize: 16,
//         color: '#000',
//         backgroundColor: '#fff',
//         borderRadius: 5,
//     },
//     socialContainer: {
//         flexDirection: 'row',
//     },
//     socialLink: {
//         marginHorizontal: 20
//     },
//     container: {
//         flex: 1,
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: '100%',
//         backgroundColor: '#ffffff',
//         paddingVertical: 70,
//     },
//     signupLink: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '100%',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//     },
//     link: {
//         fontSize:17,
//         textDecorationLine: 'underline'
//     },
//     or: {
//         flexDirection: 'row',
//     },
//     line: {
//         marginHorizontal: 10,
//         height: 1,
//         width: '25%',
//         backgroundColor: '#000',
//         marginVertical: 20
//     },
//     label: {
//         fontWeight: 'bold',
//         paddingBottom:2
//     },
//     button: {
//         marginTop: 50,
//         paddingHorizontal: 20,
//     }
// });

// export default SignupPage;
