import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useTheme } from '../styles/ThemeContext';
import RatingStars from '../Components/RatingStars';
import { colors } from "../styles/theme";

const LogEntriesScreen = ({ route }) => {
    const { theme, isDarkMode } = useTheme();
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
            backgroundColor:  theme.backgroundColor ,
            borderRadius: 10,
        },
        logText: {
            fontSize: 16,
            marginVertical: 5,
            color: theme.textColor,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.backgroundColor, // Light red background
            padding: 20,
            borderRadius: 10,
            marginTop: 50,
        },
        emptyMessage: {
            fontSize: 18,
            color: theme.textColor,
            marginTop: 20,
            textAlign: 'center',
        },
        iconStyle: {
            fontSize: 60,
            color: colors.primary, // Tomato color
        },
    });

    return (
        <View style={styles.container}>
            {logEntries.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="film-outline" style={styles.iconStyle} />
                    <Text style={styles.emptyMessage}>
                        You currently have no movies logged, please log a movie
                    </Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={logEntries}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.logEntry}>
                            <Text style={styles.logText}>Movie Title: {item.movieTitle}</Text>
                            <View style={styles.logText}>
                                <Text style={styles.logText}>Rating: </Text>
                                <RatingStars rating={item.movieRating} />
                            </View>
                            <Text style={styles.logText}>Review: {item.review}</Text>
                            <Text style={styles.logText}>Date Watched: {item.dateWatched}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default LogEntriesScreen;
