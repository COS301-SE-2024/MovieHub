import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RatingStars from '../Components/RatingStars';

const LogEntriesScreen = ({ route }) => {
    const { logEntries } = route.params;

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
                            <Text>Rating: </Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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
    },
});

export default LogEntriesScreen;
