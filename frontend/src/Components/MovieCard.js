import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function MovieCard({imageUrl,title}) {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
            <Image source={imageUrl} style={styles.image} />
            <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 500,
        paddingRight: 15,
        paddingLeft: 15,


    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
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
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        paddingTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

});
