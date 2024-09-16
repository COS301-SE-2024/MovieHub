import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";

const CategoriesFilters = ({ categoryName, selectedCategory }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [isSelected, setIsSelected] = useState(false);

    const handleCategoryPress = (category) => {
        // navigation.navigate("MovieDescriptionPage", { category });
        setIsSelected(!isSelected);
    };

    useEffect(() => {
        setIsSelected(categoryName === selectedCategory);
    }, [selectedCategory]);

    const getButtonWidth = () => {
        const buttonWidth = categoryName.length * 10;
        return Math.max(buttonWidth, 110);
    };

    const styles = StyleSheet.create({
        container: {
            paddingBottom: 12,
            paddingTop: 14,
            backgroundColor: theme.backgroundColor,
            borderColor: theme.borderColor,
            borderBottomWidth: 0.8,
        },
        button: {
            backgroundColor: "#000000",
            paddingHorizontal: 0,
            paddingVertical: 10,
            marginHorizontal: 5,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            // height: 38,
            paddingBottom: 10,
        },
        buttonText: {
            color: "#fff",
            fontSize: 16,
        },
        selectedButton: {
            backgroundColor: theme.primaryColor,
        },
        selectedText: {
            fontWeight: "bold",
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, isSelected ? styles.selectedButton : null]} onPress={() => handleCategoryPress(categoryName)}>
                <Text style={[styles.buttonText, isSelected ? styles.selectedText : null]}>{categoryName}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CategoriesFilters;
