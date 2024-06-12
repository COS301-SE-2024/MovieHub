import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchHeader from '../Components/SearchHeader';

export default function SearchPage() {
    return (
        <View style={styles.container}>
            {/* <SearchHeader /> */}
            <View style={styles.searchBar}>
                <Icon name='search' size={30} />
                <TextInput
                    style={styles.input}
                    placeholder=""
                />
                <Icon name='mic' size={30} />
            </View>
            <Text style={styles.title}>Browse Genres</Text>
            <View style={styles.grid}>
                {['Action', 'Anime', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy'].map((genre) => (
                    <TouchableOpacity key={genre} style={styles.genreBox}>
                        <Text style={styles.genreText}>{genre}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    genreBox: {
        width: '48%',
        backgroundColor: '#e0e0e0',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    genreText: {
        fontSize: 18,
    }
});
