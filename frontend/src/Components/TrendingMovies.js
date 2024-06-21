import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function MovieCard({imageUrl,title, rating, overview, date}) {

    const navigation = useNavigation();

    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", {imageUrl,title, rating, overview, date});
    };

    return (
        <TouchableWithoutFeedback onPress={handleNewUser}>
            <View style={styles.container}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
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
        backgroundColor: "#fff"

    },
      image: {
        paddingTop:10,
        width: '100%',
        height: '90%',
        borderRadius: 10,
        borderColor: '#000000',
    },

});