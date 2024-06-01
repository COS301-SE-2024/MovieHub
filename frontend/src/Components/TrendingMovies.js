import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function MovieCard({imageUrl}) {
    return (
        <View style={styles.container}>
           
            <Image source={imageUrl} style={styles.image} />
        
        </View>
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