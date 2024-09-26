import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import { colors, themeStyles } from "../styles/theme";

export default function MovieCard({movieId,imageUrl,title, rating, overview, date}) {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", {movieId,imageUrl,title, rating, overview, date});
    };

    return (
        <TouchableWithoutFeedback onPress={handleNewUser}>
            <View style={styles.container}>
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1 }} // Adjust position if necessary
                />
            )}
                <Image source={{ uri: imageUrl }} style={styles.image} onLoadEnd={() => setLoading(false)} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 170,
        height: 250,
        paddingRight: 15,
        paddingLeft: 15,
        shadowOffset: {
            width: 0,
            height: 3,
            },
    
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        // backgroundColor: "#ffff"

    },
      image: {
        paddingTop:10,
        width: '100%',
        height: '90%',
        borderRadius: 10,
        borderColor: '#ffffff',
        shadowOffset: {
            width: 0,
            height: 3,
            },
    
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        
    },

});