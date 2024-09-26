import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";

const SearchBar = ({ onChangeText }) => {
    const { theme } = useTheme();
    
    const styles = StyleSheet.create({
        searchBarContainer: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: theme.backgroundColor,
        },
        searchBar: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 25,
            borderWidth: 0.5,
            paddingHorizontal: 12,
            height: 40,
            borderColor: theme.textColor,
        },
        searchIcon: {
            marginRight: 8,
        },
        input: {
            flex: 1,
            fontSize: 16,
            fontFamily: "Roboto",
            color: theme.placeholderTextColor,
        },
    });
    return (
        <View style={styles.searchBarContainer}>
            <View style={[styles.searchBar, { backgroundColor: theme.secondaryBackgroundColor, borderColor: theme.borderColor }]}>
                <Ionicons name="search" size={20} color={theme.textColor} style={styles.searchIcon} />
                <TextInput style={[styles.input, { color: theme.textColor }]} placeholder="Search by username or name" placeholderTextColor={theme.textColor} onChangeText={onChangeText} />
            </View>
        </View>
    );
};

export default SearchBar;
