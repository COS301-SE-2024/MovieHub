import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../styles/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SearchHeader() {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        header: {
            height: 90,
            paddingTop: 38,
            backgroundColor: theme.backgroundColor,
            flexDirection: 'row',
            paddingHorizontal: 10,
        },
        backButton: {
            paddingRight: 10,
            // paddingLeft: 10,
            paddingTop: 20,
            fontFamily: 'Roboto',
            color: theme.textColor,
            fontSize: 20,
            fontWeight: 'bold',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            paddingTop: 24,
            paddingRight: 15,
            color: theme.textColor,
        },
    });

    
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name='arrow-back' size={30} color={theme.iconColor} />
            </TouchableOpacity>
            {/* <Text style={styles.title}>Search</Text> */}
        </View>
    );
}