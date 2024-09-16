import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { colors, themeStyles } from '../styles/theme';
import { useTheme } from '../styles/ThemeContext';

export default function HomeHeader({ userInfo }) {
    const { theme } = useTheme();
    const navigation = useNavigation(); // Access the navigation prop using the hook

    return (
        <View style={styles.header}>
            <Text style={styles.logo}>movieHub.</Text>
            <Pressable style={styles.icon} onPress={() => navigation.navigate('SearchPage', { userInfo })}>
                <Icon name='search' size={30} color={"white"} style={styles.iconShadow} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { 
        height: 90,
        paddingTop: 28,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    logo: {
        paddingLeft: 20,
        fontFamily: 'Roboto',
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 0.4},
        textShadowRadius: 12
    },
    icon: {
        paddingRight: 15,
    },
    iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    }
});
