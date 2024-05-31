import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import movie2 from '../../../assets/Assassin_movie.jpg'

export default function MainHeader() {
    return (
        <View style={styles.header}>
            <View style={styles.iconRow}>
                <Icon name='home' size={30} paddingLeft={10} style={styles.icon} />
                <Icon name='notifications' size={30} style={styles.icon} />
                <Icon name='chat' size={30} style={styles.icon} />
                <TouchableOpacity >
                <Image source={movie2} size={30} style={styles.Image} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 65,
        paddingBottom: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%', 
        paddingRight: 20,
        paddingleft: 30,
    },
    icon: {
        textAlign: 'center',
    },

    Image: {
        height: 30,
        width: 30,
        borderRadius: 15,


    }
});
