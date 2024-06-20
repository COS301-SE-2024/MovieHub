import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

export default function AddMovies({ navigation }) {
    // Sample data for movie placeholders 
    const [movies, setMovies] = useState(new Array(9).fill(false)); 

    const toggleMovieSelection = (index) => {
        const newMovies = [...movies];
        newMovies[index] = !newMovies[index];
        setMovies(newMovies);
    };

    const renderMovieItem = ({ item, index }) => (
        <TouchableOpacity style={styles.movieItem} onPress={() => toggleMovieSelection(index)}>
            {item && <View style={styles.tick} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Movies to Watchlist</Text>
                <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('ProfilePage')}>
                    <Text style={styles.nextButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={movies}
                renderItem={renderMovieItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.grid}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    backButton: {
        fontSize: 24,
        color: "#000",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    doneText: {
        fontSize: 16,
        color: "blue",
    },
    grid: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    movieItem: {
        width: "45%",
        height: 175,
        margin: "1.5%",
        backgroundColor: "#e1e1e1",
        justifyContent: "center",
        alignItems: "center",
    },
    tick: {
        width: 30,
        height: 30,
        backgroundColor: "black",
        borderRadius: 15,
    },
});
