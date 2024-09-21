import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";

export default function Rating({ rating }) {
    const { theme } = useTheme();
    const filledStars = Math.floor(rating / 2);
    const maxStars = Array(5 - filledStars).fill("staro");
    const r = [...Array(filledStars).fill("star"), ...maxStars];

    // round of rating to 1 decimal place
    rating = Math.round(rating * 10) / 10;

    const styles = StyleSheet.create({
        ratingNumber: {
            marginRight: 4,
            fontFamily: "Roboto",
            fontSize: 14,
            color: theme.textColor
        },
        rating: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 4,
        },
    });

    return (
        <View style={styles.rating}>
            <Text style={styles.ratingNumber}>{rating}</Text>
            <AntDesign name={"star"} size={12} color="tomato" />
        </View>
    );
}
