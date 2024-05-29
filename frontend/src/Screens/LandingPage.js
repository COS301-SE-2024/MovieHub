import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, ScrollView, Image} from 'react-native';
import landing1 from "../../../assets/landing1.png";
import landing2 from "../../../assets/landing2.png";
import landing3 from "../../../assets/landing3.png";
import landing4 from "../../../assets/landing4.png";
import movie5 from '../../../assets/oppenheimer_movie.jpg'

const LandingPage = () => {
    return (
        <View style={styles.container}>
            <Image source={landing1} style={styles.image} />
            <Button
                title="Create Account"
                color="#000000"
            />
            <Button
                title="Login"
                color="#ffffff"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fffff'
    },
    image: {
        margin:50,
        padding:10,
        width: '70%',
        height: '70%',
        borderRadius: 10,
        borderColor: '#000000',
    }
});

export default LandingPage;
