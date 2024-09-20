import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../styles/ThemeContext';
import RatingStars from '../Components/RatingStars';

const LogEntriesScreen = ({ route }) => {
    const { theme } = useTheme();
    const { logEntries } = route.params;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.backgroundColor,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: theme.textColor,
        },
        logEntry: {
            marginVertical: 10,
            padding: 15,
            backgroundColor: '#f9f9f9',
            borderRadius: 10,
        },
        logText: {
            fontSize: 16,
            marginVertical: 5,
            color: theme.textColor,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Entries</Text>
            <FlatList
                data={logEntries}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.logEntry}>
                        <Text style={styles.logText}>Title: {item.movieTitle}</Text>
                        <View style={styles.logText}>
                            <Text style={{ color: theme.textColor }}>Rating: </Text>
                            <RatingStars rating={item.movieRating} />
                        </View>
                        <Text style={styles.logText}>Review: {item.review}</Text>
                        <Text style={styles.logText}>Date Watched: {item.dateWatched}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default LogEntriesScreen;
