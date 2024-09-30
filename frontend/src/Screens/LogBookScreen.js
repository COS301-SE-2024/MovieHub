import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import RatingStars from "../Components/RatingStars";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const LogBookScreen = () => {
    const { theme } = useTheme();
    const [movieRating, setMovieRating] = useState("");
    const [review, setReview] = useState("");
    const [dateWatched, setDateWatched] = useState("");
    const [logEntries, setLogEntries] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const route = useRoute();
    const { title } = route.params;
    const [rating, setRating] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        loadLogEntries();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={viewLogEntries} style={styles.headerButton}>
                    <Ionicons name="book-outline" size={24} color={theme.iconColor} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, logEntries]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // const loadLogEntries = async () => {
    //     try {
    //         const entries = await AsyncStorage.getItem("logEntries");
    //         if (entries) {
    //             setLogEntries(JSON.parse(entries));
    //         }
    //     } catch (error) {
    //         console.error("Failed to load log entries", error);
    //     }
    // };

    // const saveLogEntries = async (entries) => {
    //     try {
    //         await AsyncStorage.setItem("logEntries", JSON.stringify(entries));
    //     } catch (error) {
    //         console.error("Failed to save log entries", error);
    //     }
    // };

    const handleConfirm = (date) => {
        setDateWatched(date);
        hideDatePicker();
    };

    const addLogEntry = () => {
        const newEntry = {
            movieTitle: title,
            movieRating: rating,
            review,
            dateWatched: dateWatched ? dateWatched.toDateString() : "Not specified",
        };
        const updatedEntries = [...logEntries, newEntry];
        setLogEntries(updatedEntries);
        saveLogEntries(updatedEntries);
        setMovieRating("");
        setReview("");
        setDateWatched("");
    };

    const viewLogEntries = () => {
        navigation.navigate("LogEntriesScreen", { logEntries });
    };

    const { userId } = route.params; // Assuming userId is passed as a parameter

// Modify the loadLogEntries function to include the userId in the key
const loadLogEntries = async () => {
    try {
        const entries = await AsyncStorage.getItem(`logEntries_${userId}`);
        if (entries) {
            setLogEntries(JSON.parse(entries));
        }
    } catch (error) {
        console.error("Failed to load log entries", error);
    }
};

// Modify the saveLogEntries function to include the userId in the key
const saveLogEntries = async (entries) => {
    try {
        await AsyncStorage.setItem(`logEntries_${userId}`, JSON.stringify(entries));
    } catch (error) {
        console.error("Failed to save log entries", error);
    }
};

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.backgroundColor,
        },
        headerButton: {
            marginRight: 10,
        },
        textArea: {
            height: 100,
            textAlignVertical: "top",
            paddingTop: 8,
        },
        heading: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
            outlineStyle: "none",
            textAlign: "center",
            color: theme.textColor,
            paddingBottom: 8
        },
        input: {
            height: 40,
            borderColor: theme.borderColor,
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
        },
        logEntry: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        logText: {
            fontSize: 16,
            color: theme.textColor,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10,
        },
        buttonText: {
            color: "#0f5bd1",
            textAlign: "center",
        },
        entryButton: {
            backgroundColor: theme.primaryColor,
            padding: 16,
            borderRadius: 4,
            alignItems: "center",
        },
        entryButtonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
        },

        movieTitle: {
            fontSize: 20,
            marginTop: 10,
            marginBottom: 10,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.textColor
        },
        subtitle: {
            fontSize: 18,
            marginTop: 20,
            fontWeight: "bold",
            color: theme.textColor,
            marginBottom: 10
        },
        label: {
            fontSize: 16,
            fontWeight: "600",
            paddingBottom: 10,
            color: theme.textColor
        },
        input: {
            height: 45,
            borderRadius: 10,
            backgroundColor: theme.inputBackground,
            paddingHorizontal: 10,
            marginBottom: 20,
        },
        datePickerButton: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderWidth: 1,
            borderColor: theme.borderColor,
            borderRadius: 5,
            marginTop: 10,
        },
        dateText: {
            marginLeft: 10,
            fontSize: 16,
            color: theme.textColor,
        },
    });

    return (
        <View style={styles.container}>

            <Text style={styles.movieTitle}>{title}</Text>

            <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                <Ionicons name="calendar-outline" size={24} color={theme.iconColor} />
                <Text style={styles.dateText}>{dateWatched ? dateWatched.toDateString() : "Select Date Watched"}</Text>
            </TouchableOpacity>

            <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} textColor={theme.textColor}/>

            <Text style={styles.subtitle}>Rate the movie:</Text>
            <RatingStars rating={rating} setRating={setRating} />

            <Text style={styles.subtitle}>Write a review</Text>
            <TextInput style={[styles.input, styles.textArea]} selectionColor={theme.textColor} color={theme.textColor} placeholderTextColor={theme.gray} value={review} onChangeText={setReview} placeholder="Add your thoughts" />

            <TouchableOpacity style={styles.entryButton} onPress={addLogEntry}>
                <Text style={styles.entryButtonText}>Log Entry</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LogBookScreen;
