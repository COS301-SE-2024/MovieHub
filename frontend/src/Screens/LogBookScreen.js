import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity,StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import RatingStars from './RatingStars';
import { Ionicons, FontAwesome6, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const LogBookScreen = () => {
    const [movieRating, setMovieRating] = useState('');
    const [review, setReview] = useState('');
    const [dateWatched, setDateWatched] = useState('');
    const [logEntries, setLogEntries] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const route = useRoute();
    const { title } = route.params;
    const [rating, setRating] = useState(0);
    

    useEffect(() => {
        loadLogEntries();
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const loadLogEntries = async () => {
        try {
            const entries = await AsyncStorage.getItem('logEntries');
            if (entries) {
                setLogEntries(JSON.parse(entries));
            }
        } catch (error) {
            console.error('Failed to load log entries', error);
        }
    };

    const saveLogEntries = async (entries) => {
        try {
            await AsyncStorage.setItem('logEntries', JSON.stringify(entries));
        } catch (error) {
            console.error('Failed to save log entries', error);
        }
    };

    const handleConfirm = (date) => {
        setDateWatched(date);
        hideDatePicker();
    };

    const addLogEntry = () => {
        const newEntry = { movieRating, review };
        const updatedEntries = [...logEntries, newEntry];
        setLogEntries(updatedEntries);
        saveLogEntries(updatedEntries);
        setMovieTitle('');
        setMovieRating('');
        setReview('');
        setDateWatched('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Log Your Movie</Text>
            

            <Text style={styles.movieTitle}>{title}</Text>

            <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                <Ionicons name="calendar-outline" size={50} color="black" />
                <Text style={styles.dateText}>
                    {dateWatched ? dateWatched.toDateString() : "Select Date Watched"}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <Text style={styles.subtitle}>Rate the movie:</Text>

            <RatingStars rating={rating} setRating={setRating} />
            
            <Text style={styles.subtitle}>Write a review</Text>
            <TextInput style={[styles.input, styles.textArea]}  selectionColor="#000"value={review} onChangeText={setReview} placeholder="Add your thoughts" />

            
            
            <TouchableOpacity style={styles.entryButton} onPress={addLogEntry}>
                <Text style={styles.entryButtonText}>Log Entry</Text>
            </TouchableOpacity>

            {/* <FlatList
                data={logEntries}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.logEntry}>
                        <Text style={styles.logText}>Title: {item.movieTitle}</Text>
                        <View style={styles.logText}>
                            <Text>Rating: </Text>
                            <RatingStars rating={item.movieRating} />
                        </View>
                        <Text style={styles.logText}>Review: {item.review}</Text>
                        <Text style={styles.logText}>Date Watched: {item.dateWatched}</Text>
                    </View>
                )}
            /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
        paddingTop: 8,
    },

    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop:50,
        borderBottomWidth: 1,
        borderBottomColor: "#7b7b7b",
        outlineStyle: "none",
        textAlign: "center"
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    logEntry: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    logText: {
        fontSize: 16,
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
        backgroundColor: "black",
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
    },
    subtitle: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: "bold"
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        paddingBottom: 10,
    },
    input: {
        height: 45,
        borderRadius: 10,
        backgroundColor: "#D9D9D9",
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginTop: 10,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default LogBookScreen;
