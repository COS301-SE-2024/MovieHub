import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogBookScreen = () => {
    const [movieTitle, setMovieTitle] = useState('');
    const [movieRating, setMovieRating] = useState('');
    const [review, setReview] = useState('');
    const [dateWatched, setDateWatched] = useState('');
    const [logEntries, setLogEntries] = useState([]);

    useEffect(() => {
        loadLogEntries();
    }, []);

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

    const addLogEntry = () => {
        const newEntry = { movieTitle, movieRating, review, dateWatched };
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
            <Text style={styles.heading}>Log Your Movies</Text>
            <TextInput
                style={styles.input}
                placeholder="Movie Title"
                value={movieTitle}
                onChangeText={setMovieTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Rating"
                value={movieRating}
                onChangeText={setMovieRating}
            />
            <TextInput
                style={styles.input}
                placeholder="Review"
                value={review}
                onChangeText={setReview}
            />
            <TextInput
                style={styles.input}
                placeholder="Date Watched"
                value={dateWatched}
                onChangeText={setDateWatched}
            />
            <Button title="Add Entry" onPress={addLogEntry} />
            <FlatList
                data={logEntries}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.logEntry}>
                        <Text style={styles.logText}>Title: {item.movieTitle}</Text>
                        <Text style={styles.logText}>Rating: {item.movieRating}</Text>
                        <Text style={styles.logText}>Review: {item.review}</Text>
                        <Text style={styles.logText}>Date Watched: {item.dateWatched}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
});

export default LogBookScreen;
