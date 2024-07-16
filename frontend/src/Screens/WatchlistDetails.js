import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const WatchlistDetails = ({ route }) => {
    const { watchlist } = route.params;
    
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{watchlist.name}</Text>
                <Text style={styles.privacy}>{watchlist.privacy}</Text>
                <Text style={styles.moviesCount}>{watchlist.movies} movies</Text>
                
                <ScrollView>
                    {watchlist.moviesList.map((movie) => (
                        <View key={movie.id} style={styles.movieItem}>
                            <Image source={movie.image} style={styles.movieImage} />
                            <Text style={styles.movieTitle}>{movie.title}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    privacy: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    moviesCount: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    movieItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    movieImage: {
        width: 100,
        height: 150,
        marginRight: 16,
    },
    movieTitle: {
        fontSize: 18,
        alignSelf: 'center',
    },
});

export default WatchlistDetails;
