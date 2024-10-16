import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useTheme } from "../styles/ThemeContext";

export default function MovieCard({ imageUrl, name }) {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: 105,
            height: 105,
            paddingRight: 15,
            paddingLeft: 15,
            backgroundColor: "transparent",
            borderRadius: 50,
        },
        image: {
            paddingTop: 10,
            width: "100%",
            height: "73%",
            borderRadius: 80,
            borderColor: "#000000",
        },
    
        noImage: {
            width: 100,
            height: 150,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ccc",
            borderRadius: 5,
        },
        noImageText: {
            color: "#fff",
            fontSize: 12,
        },
    });    

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
    );
}