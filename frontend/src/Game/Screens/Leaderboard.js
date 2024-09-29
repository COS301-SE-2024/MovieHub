import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import GameBottomHeader from '../Components/GameBottomHeader';
import { useTheme } from '../../styles/ThemeContext';

const Leaderboard = () => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
    });
    
    return (
        <View style={styles.container}>
            <Text>Leaderboard</Text>
            <GameBottomHeader />
        </View>
    )
}

export default Leaderboard