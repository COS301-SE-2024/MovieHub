import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import { Dimensions } from 'react-native';
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
export default function MovieCard({ movieId, imageUrl, title, rating, overview, date }) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const navigation = useNavigation();

    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", { movieId: movieId, imageUrl: imageUrl, title: title, rating: rating, overview: overview, date: date });
    };

    

    const handleLikePress = () => {
        setLiked(!liked);
    };

    return (
        <View style={styles.container}>
            
        <TouchableOpacity onPress={handleNewUser} activeOpacity={1} style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            
            {/* <Text style={styles.title}>{title}</Text> */}
                
        </TouchableOpacity>
    </View>
    );
}

const screenWidth = Dimensions.get('window').width;
 
const styles = StyleSheet.create({

    container:{
        flex: 1,
        position: 'center',
        alignItems: 'center',
        width: screenWidth,
        height: 430,
        // paddingRight: 15,
        // paddingLeft: 15,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: 10,
        paddingBottom: 120,


    },
    card: {
        position: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '76%',
        backgroundColor: 'transparent',
        borderRadius: 10,
        // padding: 10,
        shadowColor: '#000',
        height: 400,
        shadowOffset: {
        width: 0,
        height: 3,
        },

        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        marginBottom: 10,
        position: 'center',
        alignItems: 'center',
    },


}) 
