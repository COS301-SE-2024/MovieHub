import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../styles/ThemeContext";

const Instructions = () => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
    });
    return (
        <View style={styles.container}>
            <Text>Instructions</Text>  
        </View> 
    );
};

export default Instructions;
