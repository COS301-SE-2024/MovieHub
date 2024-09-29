import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import GameBottomHeader from '../Components/GameBottomHeader';
import { useTheme } from '../../styles/ThemeContext';

const Quiz = () => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
    });

    return (
        <View style={styles.container}>
            <Text>Quiz</Text>
            <GameBottomHeader />
        </View>
    )
}

export default Quiz