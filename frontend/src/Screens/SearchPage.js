import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image,RefreshControl,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomHeader from '../Components/BottomHeader';
import { getPopularMovies, getMoviesByGenre, getNewMovies, getTopPicksForToday,fetchClassicMovies } from '../Services/TMDBApiService';

const genreMap = {
    12: "Adventure",
    14: "Fantasy",
    16: "Animation",
    18: "Drama",
    27: "Horror",
    28: "Action",
    35: "Comedy",
    36: "History",
    37: "Western",
    53: "Thriller",
    80: "Crime",
    99: "Documentary",
    878: "Science Fiction",
    9648: "Mystery",
    10402: "Music",
    10749: "Romance",
    10751: "Family",
    10752: "War",
    10770: "TV Movie",
};

// Convert genreMap to an array and sort it
const sortedGenres = Object.entries(genreMap).sort(([, a], [, b]) => a.localeCompare(b));

const SearchPage = ({ route }) => {
    const { userInfo } = route.params;
    const navigation = useNavigation();
    let [genreData, setGenreData] = useState({});
    const [genrePosters, setGenrePosters] = useState({});

    const genres = {
        Action: 28,
        Adventure: 12,
        Animation: 16,
        Comedy: 35,
        Crime: 80,
        Documentary: 99,
        Drama: 18,
        Family: 10751,
        Fantasy: 14,
        History: 36,
        Horror: 27,
        Musical: 10402,
        Mystery: 9648,
        Romance: 10749,
        'Sci-Fi': 878,
        Sport: 10770,
        Thriller: 53
    };

    let [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        const fetchPosters = async () => {
            const posters = {};
            const usedPosters = new Set(); // set of posters that have been used
            for (const [genreId, genreName] of sortedGenres) {
                const movies = await getMoviesByGenre(genreId);
                if (movies.length > 0) {
                    let posterPath = `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`;
                    let index = 0;
                    // Ensure the poster is unique
                    while (usedPosters.has(posterPath) && index < movies.length) {
                        index++;
                        posterPath = `https://image.tmdb.org/t/p/w500${movies[index].poster_path}`;
                    }
                    usedPosters.add(posterPath);
                    posters[genreName] = posterPath;
                }
            }
            setGenrePosters(posters);
        };
        fetchPosters();
    }, []);

    
    const fetchMovies = async () => {
        try {
            const genreDataTemp = {};
            for (let genre in genres) {
                const genreId = genres[genre];

                const top10 = await getMoviesByGenre(genreId, 'popularity.desc');
                const mostWatched = await getTopPicksForToday(genreId);
                const newMovies = await getNewMovies(genreId);
                const topPicks = await getTopPicksForToday(genreId);
                const classicMovies = await fetchClassicMovies(genreId);

                genreDataTemp[genre] = {
                    top10: top10.slice(0, 10),
                    mostWatched: mostWatched.slice(0, 20),
                    newMovies: newMovies.slice(0, 20),
                    topPicks: topPicks.slice(0, 20),
                    classics: classicMovies
                };
            }
            setGenreData(genreDataTemp);

            console.log('Genre Data in SearchPage:', genreData);
        } catch (error) {

            console.error('Error fetching movies:', error);
        }
    };

    const fetchClassicMovies = async (genreId) => {
        try {
            const movies = await getMoviesByGenre(genreId);
            return movies.filter(movie => movie.vote_average >= 8.0 && movie.popularity >= 100);
        } catch (error) {
            console.error(`Error fetching classic movies for genre ${genreId}:`, error);
            return [];
        }
    };

    

    const handleRefresh = () => {
        setRefreshing(true);
        fetchMovies().then(() => setRefreshing(false));
    };
    

        useEffect(() => {
        fetchMovies();
        }, []);

    // const genres = ['Action','Adventure', 'Animation','Anime', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family','Fantasy', 'History','Horror','Musical','Mystery','Romance','Sci-Fi','Sport','Thriller'];

    const handleGenrePress = (genre) => {
        navigation.navigate('GenrePage', { genreName: genre, genreData: genreData[genre] });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Icon name="search" size={30} style={{ marginRight: 8 }} />
                <TextInput style={styles.input} placeholder="Search movies, actors, or movie lines" />
                <Icon name="mic" size={30} color={"gray"} style={{ marginLeft: 8 }} />
            </View>
            <Text style={styles.title}>Browse Genres</Text>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {sortedGenres.map(([genreId, genre]) => (
                        <TouchableOpacity key={genre} style={styles.genreBox} onPress={() => handleGenrePress(genre)}>
                            <ImageBackground source={{ uri: genrePosters[genre] }} style={styles.genreImage} resizeMode="cover">
                                <Text style={styles.genreText}>{genre}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            {/* <BottomHeader style={styles.bottomHeader} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    searchBar: {
        flexDirection: "row",
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        padding: 10,
        marginTop: 15,
        alignItems: "center",
    },
    input: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 20,
    },
    scrollContainer: {
        flex: 1,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 5,
    },
    genreBox: {
        width: "48%",
        backgroundColor: "#e0e0e0",
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    genreImage: {
        width: "100%",
        height: "100%",
    },
    genreText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#00000080",
        flex: 1,
        textAlignVertical: "center",
    },
});

export default SearchPage;
