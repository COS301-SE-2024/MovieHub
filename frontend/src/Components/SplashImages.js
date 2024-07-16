import React, { useState } from 'react';
import { StyleSheet, Button, Pressable, Text, View, ScrollView, Image, Dimensions } from 'react-native';
import landing1 from "../../../assets/film2.jpg";
import landing4 from "../../../assets/film.jpg";
import landing3 from "../../../assets/vintagefilm.jpg";
import landing2 from "../../../assets/neon.jpg";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SplashImages = ({ image }) => {

    return (
        <View style={styles.container}>
                    <Image source={image} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    container:{
        flex:1,
        backgroundColor: '#000000',
    },

});

export default SplashImages;
