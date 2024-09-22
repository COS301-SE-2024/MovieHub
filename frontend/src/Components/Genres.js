import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../styles/ThemeContext";

export default function Genres({ genres }) {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        genres: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginVertical: 4,
        },
        genre: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderWidth: 1,
            borderRadius: 14,
            borderColor: theme.gray,
            marginRight: 4,
            marginBottom: 4,
        },
        genreText: {
            fontSize: 9,
            opacity: 0.4,
            color: theme.textColor,
        },
    });

    return (
        <View style={styles.genres}>
            {genres.map((genre, i) => {
                return (
                    <View key={genre} style={styles.genre}>
                        <Text style={styles.genreText}>{genre}</Text>
                    </View>
                );
            })}
        </View>
    );
}
