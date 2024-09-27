import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import { Dimensions } from 'react-native';
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { colors, themeStyles } from "../styles/theme";
export default function MovieCard({ movieId, imageUrl, title, rating, overview, date, userInfo }) {
    const { theme } = useTheme();
    const [liked, setLiked] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", { movieId: movieId, imageUrl: imageUrl, title: title, rating: rating, overview: overview, date: date, userInfo: userInfo });
    };

    

    const handleLikePress = () => {
        setLiked(!liked);
    };

    return (
        <View style={styles.container}>
            
        <TouchableOpacity onPress={handleNewUser} activeOpacity={1} style={styles.card}>
        {loading && (
                <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1 }} // Adjust position if necessary
                />
            )}
            <Image source={{ uri: imageUrl }} style={styles.image} onLoadEnd={() => setLoading(false)} />
            
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
        width: 330,
        height: 420,
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
        width: '86%',
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
