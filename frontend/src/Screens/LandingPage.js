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
            <ScrollView horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}>
                <View style={styles.imgContainer}>
                    <Image source={landing1}/>
                    <Text style={styles.subTitle}>Welcome to MovieHub</Text>
                    <Text style={styles.text}>Discover, review, and discuss your favourite films on the ultimate platform for movie enthusiasts.</Text>
                </View>
                <View style={styles.imgContainer}>
                    <Image source={landing2}/>
                    <Text style={styles.subTitle}>Connect With Other Movie Lovers</Text>
                    <Text style={styles.text}>Follow friends, like reviews, and comment on discussions to build your own network.</Text>
                </View>
                <View style={styles.imgContainer}>
                    <Image source={landing3}/>
                    <Text style={styles.subTitle}>Share Your Thoughts</Text>
                    <Text style={styles.text}>Write and submit reviews, and share your thoughts with a community of movie enthusiasts.</Text>
                </View>
                <View style={styles.imgContainer}>
                    <Image source={landing4}/>
                    <Text style={styles.subTitle}>Get Personalised Recommendations</Text>
                    <Text style={styles.text}>Enjoy movie suggestions tailored to your unique tastes and viewing history.</Text>
                </View>
                </ScrollView>
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
    subTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        width: 350
    },
    imgContainer: {
        width: '200',
        height: '200',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
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
        height: '200',
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
