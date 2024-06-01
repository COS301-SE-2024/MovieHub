import React, { useState } from 'react';
import { StyleSheet, Button, Pressable, Text, View, ScrollView, Image} from 'react-native';
import landing1 from "../../../assets/landing1.png";
import landing2 from "../../../assets/landing2.png";
import landing3 from "../../../assets/landing3.png";
import landing4 from "../../../assets/landing4.png";
import movie5 from '../../../assets/oppenheimer_movie.jpg'

const LandingPage = () => {
    return (
        <View style={styles.container}>
            <Image source={landing1} style={styles.image} />
            <Pressable style={styles.create}>
                <Text style={styles.createText}>Create Account</Text>
            </Pressable>
            <Pressable style={styles.login}>
                <Text style={styles.loginText}>Login</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 50
    },
    image: {
        margin:50,
        padding:10,
        width: '70%',
        height: '70%',
        borderRadius: 10,
        borderColor: '#000000',
    },
    create: {
        margin: 10,
        width: '70%',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#000000',
        backgroundColor: '#000000',
        borderWidth: 1.5
    },
    createText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16
    },
    login: {
        margin: 10,
        width: '70%',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#000000',
        backgroundColor: '#ffffff',
        borderWidth: 1.5
    },
    loginText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 16
    }
});

export default LandingPage;
