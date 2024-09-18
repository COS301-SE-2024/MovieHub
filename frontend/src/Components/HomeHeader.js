import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { colors, themeStyles } from '../styles/theme';
import { useTheme } from '../styles/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/theme'; // Assuming you have a theme file

// Get screen dimensions
const { height, width } = Dimensions.get('window');

export default function HomeHeader({ userInfo }) {
    const { theme } = useTheme();
    const navigation = useNavigation(); // Access the navigation prop using the hook
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <Text style={styles.logo}>movieHub.</Text>
            <Pressable 
                style={styles.icon} 
                onPress={() => navigation.navigate('SearchPage', { userInfo })}
            >
                <Icon name='search' size={30} color={"white"} style={styles.iconShadow} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: height * 0.12,      // Set header height as 12% of the screen height
        paddingTop: Platform.OS === 'ios' ? height * 0.04 : height * 0.03, // Adjust padding for status bar on iOS
        paddingHorizontal: width * 0.05, // 5% of screen width for left/right padding
        flexDirection: 'row',      // Horizontal alignment
        justifyContent: 'space-between', // Evenly space logo and icon
        zIndex: 1,
        alignItems: 'center',      // Vertical centering
        // backgroundColor: colors.primary, // Header background color
        elevation: 4,              // Shadow on Android
        shadowColor: '#000',       // Shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        position: 'relative',
    },
    logo: {
        color: colors.primary,            // White logo text
        fontSize: width * 0.06,    // Set font size relative to screen width (6% of width)
        fontWeight: 'bold',        // Bold logo
        fontFamily: 'Roboto',      // Custom font
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for the logo
        textShadowOffset: { width: -1, height: 0.4 },
        textShadowRadius: 12,
    },
    icon: {
        paddingRight: width * 0.03,  // Padding on the right as a percentage of the screen width
    },
    iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow for the search icon
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    }
});
