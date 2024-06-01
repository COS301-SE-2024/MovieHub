import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MainHeader() {
    return (
        <View style={styles.header}>
            <Text style={styles.logo}>movieHub.</Text>
            <View style={styles.icon}>
                <Icon name='search' size={30}></Icon>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { 
        height: 90,
        paddingTop: 38,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logo: {
        paddingLeft:10,
        paddingTop:20,
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },

    icon: {
        paddingTop: 17,
        paddingRight:15,
    }
});