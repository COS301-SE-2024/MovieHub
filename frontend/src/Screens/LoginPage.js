import React, { useState } from "react";
import { StyleSheet, Button, Text, TextInput, View, Image, TouchableOpacity, Pressable } from "react-native";
import google from "../../../assets/googles.png";
import facebook from "../../../assets/facebook.png";
import twitter from "../../../assets/apple-logo.png";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { signIn } from "../../../backend/src/services/authService";

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
        try {
            await signIn(email, password);
            console.log("User signed in successfully");
            navigation.navigate("HomePage");
            
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>movieHub.</Text>
            <Text style={styles.title}>Welcome Back!</Text>
            <View>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.inputText} onChangeText={setEmail} value={email} placeholder="" />
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

            <View style={styles.btn}>
                <Pressable style={styles.button} onPress={HandleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                {error ? <Text>{error}</Text> : null}
            </View>
            <View style={styles.forgot}>
                <Text style={{ color: "#0f5bd1" }}>Forgot password?</Text>
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
                <Text style={{ fontSize: 16 }}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleNewUser}>
                    <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontFamily: "Roboto",
        color: "#000000",
        fontSize: 25,
        fontWeight: "bold",
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

export default LoginPage;

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
