import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, RefreshControl, ImageBackground, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPopularMovies, getMoviesByGenre, getMovieDetails, getNewMovies, getTopPicksForToday, fetchClassicMovies } from "../Services/TMDBApiService";
import { searchMoviesFuzzy, getMovieByQuote } from "../Services/esSearchApiServices";
import { useTheme } from "../styles/ThemeContext";

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
    const { theme } = useTheme();
    const { userInfo } = route.params || {};
    const navigation = useNavigation();
    let [genreData, setGenreData] = useState({});
    const [genrePosters, setGenrePosters] = useState({});
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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
        "Sci-Fi": 878,
        Sport: 10770,
        Thriller: 53,
    };

    let [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchPosters = async () => {
            const posters = {};
            const usedPosters = new Set();
            const cachedPosters = await AsyncStorage.getItem('cachedPosters');
            const parsedCachedPosters = cachedPosters ? JSON.parse(cachedPosters) : {};
    
            for (const [genreId, genreName] of sortedGenres) {
                if (parsedCachedPosters[genreName]) {
                    posters[genreName] = parsedCachedPosters[genreName];
                    continue;
                }
    
                const movies = await getMoviesByGenre(genreId);
                if (movies.length > 0) {
                    let posterPath = `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`;
                    let index = 0;
                    while (usedPosters.has(posterPath) && index < movies.length) {
                        index++;
                        if (index < movies.length) {
                            posterPath = `https://image.tmdb.org/t/p/w500${movies[index].poster_path}`;
                        } else {
                            break;
                        }
                    }
                    usedPosters.add(posterPath);
                    posters[genreName] = posterPath;

                    parsedCachedPosters[genreName] = posterPath;
                }
            }
            
            await AsyncStorage.setItem('cachedPosters', JSON.stringify(parsedCachedPosters));
            setGenrePosters(posters);
        };
    
        fetchPosters();
    }, []);

    const fetchMovies = async () => {
        try {
            const genreDataTemp = {};
            for (let genre in genres) {
                const genreId = genres[genre];

                const top10 = await getMoviesByGenre(genreId, "popularity.desc");
                const mostWatched = await getTopPicksForToday(genreId);
                const newMovies = await getNewMovies(genreId);
                const topPicks = await getTopPicksForToday(genreId);
                const classicMovies = await fetchClassicMovies(genreId);

                genreDataTemp[genre] = {
                    top10: top10.slice(0, 10),
                    mostWatched: mostWatched.slice(0, 20),
                    newMovies: newMovies.slice(0, 20),
                    topPicks: topPicks.slice(0, 20),
                    classics: classicMovies,
                };
            }
            setGenreData(genreDataTemp);

            // console.log('Genre Data in SearchPage:', genreData);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const fetchClassicMovies = async (genreId) => {
        try {
            const movies = await getMoviesByGenre(genreId);
            return movies.filter((movie) => movie.vote_average >= 8.0 && movie.popularity >= 100);
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
    const handleSearch = async (text) => {
        if (text === "") {
            setSearchResults([]);
            return;
        }
        try {
            const results = await searchMoviesFuzzy(text);

            // fetch posters as well and add onto results
            const moviesWithPosters = await Promise.all(
                results.movies.map(async (movie) => {
                    const movieDetails = await getMovieDetails(movie._id);
                    return { ...movie, poster_path: movieDetails.poster_path };
                })
            );
            // Filter out movies with null poster paths
            const validMovies = moviesWithPosters.filter((movie) => movie.poster_path !== null);

            setSearchResults(validMovies);
        } catch (error) {
            console.error("Error searching movies:", error);
        }
    };

    const handleSearchByQuote = async (quote) => {
        const results = await getMovieByQuote(quote);

        console.log(results);
    };

    const handleGenrePress = (genre) => {
        navigation.navigate("GenrePage", { genreName: genre, genreData: genreData[genre] });
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity style={styles.movieItem} onPress={() => handleMoviePress(item)}>
            {item.poster_path !== "null" && <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.movieImage} resizeMode="cover" />}
        </TouchableOpacity>
    );

    const renderGenreItem = ({ item }) => {
        const [genreId, genre] = item;
        return (
            <TouchableOpacity key={genreId} style={styles.genreBox} onPress={() => handleGenrePress(genre)}>
                <ImageBackground source={{ uri: genrePosters[genre] }} style={styles.genreImage} resizeMode="cover">
                    <Text style={styles.genreText}>{genre}</Text>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
            paddingHorizontal: 20,
        },
        searchBar: {
            flexDirection: "row",
            backgroundColor: theme.inputBackground,
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
            color: theme.textColor,
        },
        genreGrid: {
            justifyContent: "space-between",
        },
        genreBox: {
            width: "48%",
            backgroundColor: "#e0e0e0",
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
            marginHorizontal: "1%",
        },
        genreImage: {
            width: "100%",
            height: "100%",
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
            justifyContent: "center",
        },

        grid: {
            justifyContent: "space-between",
        },
        movieItem: {
            width: "48%",
            aspectRatio: 0.7, // Adjust this value to maintain the aspect ratio of the poster
            backgroundColor: "#e1e1e1",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            borderRadius: 10,
            marginHorizontal: "1%",
            marginVertical: 8,
        },
        movieImage: {
            width: "100%",
            height: "100%",
            borderRadius: 10,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput style={styles.input} placeholder="Search movies, actors, or movie lines" placeholderTextColor={"gray"} onChangeText={setSearchQuery} selectionColor={theme.textColor} color={theme.textColor} />
                {/* <Icon name="mic" size={30} color={"gray"} style={{ marginLeft: 8 }} /> */}
                <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
                    <Icon name="search" size={30} style={{ marginRight: 8 }} color={theme.iconColor} />
                </TouchableOpacity>
                <IonIcon
                    name="sparkles-sharp"
                    size={30}
                    color={"gold"}
                    style={{
                        marginLeft: 8,
                        textShadowColor: "rgba(0, 0, 0, 0.25)",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 8,
                    }}
                />
            </View>
            <Text style={styles.title}>{searchResults.length > 0 ? "Search Results" : "Browse Genres"}</Text>
            {searchResults.length > 0 ? <FlatList data={searchResults} renderItem={renderMovieItem} keyExtractor={(item) => item._id.toString()} numColumns={2} contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false} /> : <FlatList data={sortedGenres} renderItem={renderGenreItem} keyExtractor={(item) => item[0]} numColumns={2} contentContainerStyle={styles.genreGrid} showsVerticalScrollIndicator={false} />}
        </View>
    );
};

export default SearchPage;
