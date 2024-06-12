import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomHeader from '../Components/BottomHeader';

const SearchPage = () => {
    const navigation = useNavigation();

    const genres = ['Action','Adventure', 'Animation','Anime', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family','Fantasy', 'History','Horror','Musical','Mystery','Romance','Sci-Fi','Sport','Thriller'];

    const handleGenrePress = (genre) => {
        navigation.navigate('GenrePage', { genreName: genre });
    };

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
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {genres.map((genre) => (
                        <TouchableOpacity key={genre} style={styles.genreBox} onPress={() => handleGenrePress(genre)}>
                            <Text style={styles.genreText}>{genre}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <BottomHeader style={styles.bottomHeader} />
        </View>
    );
};

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
    scrollContainer: {
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5, // Add some padding to keep the genres centered
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

export default SearchPage;
