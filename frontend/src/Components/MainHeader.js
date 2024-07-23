import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { colors, themeStyles } from '../styles/theme';

export default function MainHeader() {
    const navigation = useNavigation(); // Access the navigation prop using the hook

    return (
        <View style={styles.header}>
            <Text style={styles.logo}>movieHub.</Text>
            <Pressable style={styles.icon} onPress={() => navigation.navigate('SearchPage')}>
                <Icon name='search' size={30} />
            </Pressable>
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
        paddingLeft: 15,
        paddingTop: 20,
        fontFamily: 'Roboto',
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    icon: {
        paddingTop: 17,
        paddingRight: 15,
    }
});
