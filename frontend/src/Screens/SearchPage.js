
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getMoviesByGenre, getMovieDetails } from "../Services/TMDBApiService";
import { searchMoviesFuzzy, getMovieByQuote } from "../Services/esSearchApiServices";

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

    const { userInfo } = route.params || {};
    const navigation = useNavigation();
    const [genrePosters, setGenrePosters] = useState({});
    const [searchResults, setSearchResults] = useState([]);

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
        navigation.navigate("GenrePage", { userInfo, genreName: genre });
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

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Icon name="search" size={30} style={{ marginRight: 8 }} />

                <TextInput style={styles.input} placeholder="Search movies, actors, or movie lines" placeholderTextColor={"gray"} onChangeText={(text) => handleSearch(text)} />
                <Icon name="mic" size={30} color={"gray"} style={{ marginLeft: 8 }} />
            </View>
            <Text style={styles.title}>{searchResults.length > 0 ? "Search Results" : "Browse Genres"}</Text>
            {searchResults.length > 0 ? <FlatList data={searchResults} renderItem={renderMovieItem} keyExtractor={(item) => item._id.toString()} numColumns={2} contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false} /> : <FlatList data={sortedGenres} renderItem={renderGenreItem} keyExtractor={(item) => item[0]} numColumns={2} contentContainerStyle={styles.genreGrid} showsVerticalScrollIndicator={false} />}

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

export default SearchPage;
