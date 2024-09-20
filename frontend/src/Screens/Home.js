import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, StatusBar, Animated, Platform, Image, Dimensions, FlatList, Pressable, LogBox, SafeAreaView,ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../styles/ThemeContext";
import { colors, themeStyles } from "../styles/theme";
import Svg from "react-native-svg";
import MovieCard from "../Components/MovieCard"
import TrendingMovie from "../Components/TrendingMovies"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getMovies } from "../api";
import { getFriendsContent } from "../Services/ExploreApiService";
import { getLikesOfReview, getLikesOfPost } from "../Services/LikesApiService";
import { getCommentsOfPost, getCommentsOfReview, getCountCommentsOfPost, getCountCommentsOfReview } from "../Services/PostsApiServices"; // Import comment count functions
import BottomHeader from "../Components/BottomHeader";
import Genres from "../Components/Genres";
import Rating from "../Components/Rating";
import Post from "../Components/Post";
import Review from "../Components/Review";
import HomeHeader from "../Components/HomeHeader";
import CommentsModal from "../Components/CommentsModal";
import moment from "moment";
import NonFollowerPost from "../Components/NonFollowerPost";
import { getPopularMovies, getMoviesByGenre, getMovieDetails, getNewMovies, getTopPicksForToday, fetchClassicMovies } from '../Services/TMDBApiService';
import { getUserProfile, getFollowingCount, getFollowersCount } from "../Services/UsersApiService";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const { width, height } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const genres = {
    Action: 28,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Mystery: 9648,
    Romance: 10749,
    'Sci-Fi': 878,
    Thriller: 53
};


const Loading = () => (
    <View style={[styles.loadingContainer]}>
        <Text style={styles.paragraph}>Loading...</Text>
    </View>
);

const Backdrop = ({ movies, scrollX }) => {
    const { theme } = useTheme();
    const { isDarkMode } = useTheme();

    return (
        <View style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.key + "-backdrop"}
                removeClippedSubviews={false}
                contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
                renderItem={({ item, index }) => {
                    if (!item.backdrop) {
                        return null;
                    }

                    const translateX = scrollX.interpolate({
                        inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
                        outputRange: [0, width],
                    });

                    return (
                        <Animated.View removeClippedSubviews={false} style={{ position: "absolute", width: translateX, height, overflow: "hidden" }}>
                            <Image
                                source={{ uri: item.backdrop }}
                                style={{
                                    width,
                                    height: BACKDROP_HEIGHT,
                                    position: "absolute",
                                }}
                            />
                        </Animated.View>
                    );
                }}
            />
            <LinearGradient
                colors={["rgba(0, 0, 0, 0)", theme.backgroundColor]}
                style={{
                    height: BACKDROP_HEIGHT,
                    width,
                    position: "absolute",
                    bottom: 0,
                }}
            />
        </View>
    );
};

const VirtualizedList = ({ children }) => {
    return <FlatList data={[]} keyExtractor={() => "key"} renderItem={null} ListHeaderComponent={<>{children}</>} />;
};

// Helper function to format the post date
const formatDate = (date) => {
    return moment(date).fromNow(); // Using moment.js to format the date as 'X time ago'
};



const Home = ({ route }) => {

    const flatlistRef = useRef(null);
    const screenWidth = Dimensions.get("window").width;
    const [activeIndex, setActiveIndex] = useState(0);
    const { userInfo } = route.params;
    const { theme } = useTheme();
    const { avatar } = route.params;
    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);
    const [userProfile, setUserProfile] = useState(null);
    const [movies, setMovies] = useState([]);
    const [isPost, setIsPost] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null); // Add this line
    // const [friendsContent, setFriendsContent] = useState([]);
    const [sortedContent, setSortedContent] = useState([]);
    const scrollX = useRef(new Animated.Value(0)).current;
    let [movies1, setMovies1] = useState([]);
    let [thrillerMovies, setThrillerMovies] = useState([]);
    let [comedyMovies, setComedyMovies] = useState([]);
    let [romanceMovies, setRomanceMovies] = useState([]);
    let [refreshing, setRefreshing] = useState(false);
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);


    useEffect(() => {
        const fetchMoviesByGenres = async () => {
          try {
            const genreMoviesPromises = Object.entries(genres).map(async ([genreName, genreId]) => {
              const movies = await getNewMovies(genreId); // Using the imported function here
              return { genre: genreName, movies };
            });
    
            const fetchedMovies = await Promise.all(genreMoviesPromises);
    
            const moviesByGenreData = fetchedMovies.reduce((acc, curr) => {
              acc[curr.genre] = curr.movies;
              return acc;
            }, {});
    
            setMoviesByGenre(moviesByGenreData);
          } catch (error) {
            console.error('Error fetching movies by genres:', error);
          }
        };
    
        fetchMoviesByGenres(); 
      }, []);

      useEffect(() => {
        const fetchOTHERMovies = async () => {
          try {
            const fetchedMovies = await getPopularMovies();
            setMovies1(fetchedMovies);
    
            const fetchedThrillerMovies = await getMoviesByGenre(53);
            setThrillerMovies(fetchedThrillerMovies);
    
            const fetchedComedyMovies = await getMoviesByGenre(35); 
            setComedyMovies(fetchedComedyMovies);
    
            const fetchedRomanceMovies = await getMoviesByGenre(28); 
            setRomanceMovies(fetchedRomanceMovies);
    
          } catch (error) {
            console.error('Error fetching movies:', error);
          } finally {
            
          }
        };
    
        fetchOTHERMovies(); 
      }, []);


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const moviesData = await getMovies();
                setMovies([{ key: "empty-left" }, ...moviesData, { key: "empty-right" }]);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        };
        
        fetchMovies();
    }, []);


    useEffect(() => {
        let interval;
    
        if (isAutoScrolling) {
            interval = setInterval(() => {
                if (activeIndex === 9) {
                    if (movies1.length > 0) {
                    flatlistRef.current?.scrollToIndex({
                        index: 0,
                        animated: true,
                    });
                }
                    setActiveIndex(0);
                } else {
                    if (movies1.length > 0) {
                    flatlistRef.current?.scrollToIndex({
                        index: activeIndex + 1,
                        animated: true,
                    });
                }
                    setActiveIndex(activeIndex + 1);
                }
            }, 2000); // Adjust the interval as needed
        }
    
        return () => clearInterval(interval);
    }, [isAutoScrolling, activeIndex, movies1]);
    const getItemLayout = (data, index) => ({
		length: screenWidth,
		offset: screenWidth * index, // for first image - 300 * 0 = 0pixels, 300 * 1 = 300, 300*2 = 600
		index: index,
	});

    const handleScrollBeginDrag = () => {
        setIsAutoScrolling(false);
    };

    const handleScrollEndDrag = () => {
        setTimeout(() => {
            setIsAutoScrolling(true);
            setActiveIndex(0); // Reset the active index to 0
            flatlistRef.current?.scrollToIndex({
            index: 0,
            animated: true,
        });
        }, 3000); 
    };

    // auto scroll
    const handleScroll = (event) => {
		// Get the scroll position
		const scrollPosition = event.nativeEvent.contentOffset.x;
		
		// Get the index of current active item

		const index = scrollPosition / screenWidth;

		
		// Update the index

		setActiveIndex(index);
	};

    const handleScrollToIndexFailed = (info) => {
        console.log('Scroll to index failed:', info);
        // Optional: Implement a fallback behavior
        // For example, scroll to the first item if the scroll fails
        flatlistRef.current.scrollToIndex({ index: 0, animated: true });
    };

    // Fetch friends content
    const fetchFriendsContent = useCallback(async () => {
        try {
            const friendsData = await getFriendsContent(userInfo);
            const { posts, reviews } = friendsData;

            const combinedContent = [...posts.map((post) => ({ ...post, type: "post" })), ...reviews.map((review) => ({ ...review, type: "review" }))];

            const sortedContent = combinedContent.sort((a, b) => new Date(b.post?.createdAt || b.review?.createdAt) - new Date(a.post?.createdAt || a.review?.createdAt));

            const enrichedContent = await Promise.all(
                sortedContent.map(async (content) => {
                    if (content.type === "post") {
                        const likes = await getLikesOfPost(content.post.postId);
                        const comments = await getCountCommentsOfPost(content.post.postId);
                        return { ...content, post: { ...content.post, likeCount: likes.data, commentCount: comments.data } };
                    }
                    if (content.type === "review") {
                        const likes = await getLikesOfReview(content.review.reviewId);
                        const comments = await getCountCommentsOfReview(content.review.reviewId);
                        return { ...content, review: { ...content.review, likeCount: likes.data, commentCount: comments.data } };
                    }
                    return content;
                })
            );

            setSortedContent(enrichedContent);
        } catch (error) {
            console.error("Failed to fetch friends content:", error);
        }
    }, [userInfo]);

    useFocusEffect(
        useCallback(() => {
            if (userInfo) {
                fetchFriendsContent();
            }
        }, [userInfo, fetchFriendsContent])
    );

    if (movies.length === 0 ) {
        return <Loading />;
    }

    const fetchComments = async (postId, isReview) => {
        setLoadingComments(true);
        if (isReview) {
            try {
                const response = await getCommentsOfReview(postId);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments of review:", error.message);
                throw new Error("Failed to fetch comments of review");
            } finally {
                setLoadingComments(false);
            }
        } else {
            try {
                const response = await getCommentsOfPost(postId);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments of post:", error.message);
                throw new Error("Failed to fetch comments of post");
            } finally {
                setLoadingComments(false);
            }
        }
    };

    const handleCommentPress = async (postId, isReview) => {
        setSelectedPostId(postId);
        setIsPost(!isReview);
        const response = await fetchComments(postId, isReview);
        bottomSheetRef.current?.present();
    };

    

    const homeStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        sectionTitle: {
            color: theme.textColor,
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
        },
    });

    const renderItem = ({ item }) => (
        <MovieCard
            movieId={item.id}
            imageUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            title={item.title}
            overview={item.overview}
            rating={item.vote_average.toFixed(1)}
            date={new Date(item.release_date).getFullYear()}
        />
    );


    return (
        <View style={homeStyles.container}>
            <VirtualizedList style={{ flex: 1 }}>
                <View style={homeStyles.container}>
                    <HomeHeader userInfo={userInfo} />
                    <Backdrop movies={movies} scrollX={scrollX} />
                    <StatusBar hidden />
                    <Animated.FlatList
                        showsHorizontalScrollIndicator={false}
                        data={movies}
                        keyExtractor={(item) => item.key}
                        horizontal
                        bounces={false}
                        decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
                        renderToHardwareTextureAndroid
                        contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
                        snapToInterval={ITEM_SIZE}
                        snapToAlignment="start"
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => {
                            if (!item.poster) {
                                return <View style={{ width: EMPTY_ITEM_SIZE }} />;
                            }

                            const inputRange = [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE, index * ITEM_SIZE];

                            const translateY = scrollX.interpolate({
                                inputRange,
                                outputRange: [55, 0, 55],
                                extrapolate: "clamp",
                            });

                            const movieDetails = {
                                movieId: item.key,
                                imageUrl: item.poster,
                                title: item.title,
                                rating: item.rating,
                                overview: item.description,
                                date: new Date(item.releaseDate).getFullYear(),
                            };

                            return (
                                <View style={{ width: ITEM_SIZE, paddingBottom: 0 }}>
                                    <Pressable onPress={() => navigation.navigate("MovieDescriptionPage", { ...movieDetails })}>
                                        <Animated.View
                                            style={{
                                                marginHorizontal: SPACING,
                                                padding: SPACING * 2,
                                                alignItems: "center",
                                                transform: [{ translateY }],
                                                backgroundColor: theme.backgroundColor,
                                                borderRadius: 34,
                                            }}>
                                            <Image source={{ uri: item.poster }} style={styles.posterImage} />
                                            <Text style={{ fontSize: 24, color: theme.textColor }} numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                            <Rating rating={item.rating} />
                                            <Genres genres={item.genres} />
                                            <Text style={{ fontSize: 12, color: theme.textColor }} numberOfLines={3}>
                                                {item.description}
                                            </Text>
                                            <Pressable onPress={() => navigation.navigate("MovieDescriptionPage", { ...movieDetails })}>
                                                <Text style={{ fontSize: 12, fontWeight: "500", color: theme.primaryColor, marginTop: 10 }}>Read more</Text>
                                            </Pressable>
                                        </Animated.View>
                                    </Pressable>
                                </View>
                            );
                        }}
                    />


            <View style={styles.line}></View>

            <View style={styles.viewall}>
             <Text  style={{
                fontSize: 23, // Ensure only one fontSize is set
                color: theme.textColor,
                paddingLeft: 16, // Padding should work
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                paddingTop: 10,
            }}>Thriller</Text>
             {/* <Text style={styles.viewalltext}>View all</Text> */}
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {thrillerMovies.slice(0, 20).map((movie, index) => (

                            <TrendingMovie
                                key={index}
                                movieId={movie.id}
                                imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                title={movie.title}
                                overview={movie.overview}
                                rating={movie.vote_average.toFixed(1)}
                                date={new Date(movie.release_date).getFullYear()}
                            />
                        ))}

            </ScrollView>

            <View style={styles.viewall}>
             <Text  style={{
                fontSize: 23, // Ensure only one fontSize is set
                color: theme.textColor,
                paddingLeft: 16, // Padding should work
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                paddingTop: 10,
            }}>Comedy</Text>
             {/* <Text style={styles.viewalltext}>View all</Text> */}
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {comedyMovies.slice(5, 24).map((movie, index) => (

                            <TrendingMovie
                                key={index}
                                movieId={movie.id}
                                imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                title={movie.title}
                                overview={movie.overview}
                                rating={movie.vote_average.toFixed(1)}
                                date={new Date(movie.release_date).getFullYear()}
                            />
                        ))}

            </ScrollView>

            <View style={styles.viewall}>
                        <Text  style={{
                fontSize: 23, // Ensure only one fontSize is set
                color: theme.textColor,
                paddingLeft: 16, // Padding should work
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                paddingTop: 10,
            }}>Romance</Text>
             {/* <Text style={styles.viewalltext}>View all</Text> */}
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {romanceMovies.slice(0, 20).map((movie, index) => (

                            <TrendingMovie
                                key={index}
                                movieId={movie.id}
                                imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                title={movie.title}
                                overview={movie.overview}
                                rating={movie.vote_average.toFixed(1)}
                                date={new Date(movie.release_date).getFullYear()}
                            />
                        ))}
            </ScrollView>

            <Text  style={{
                fontSize: 23, // Ensure only one fontSize is set
                color: theme.textColor,
                paddingLeft: 16, // Padding should work
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                paddingTop: 10,
            }}>Just for you </Text>

            <View style={styles.container1}>

            <FlatList
            data={movies1.slice(0, 10)}
            ref={flatlistRef}
            keyExtractor={(item) => item.id.toString()} // Use movie ID as key
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 0 }} // Optional: Adjust spacing
            onScroll={handleScroll}
            onScrollBeginDrag={handleScrollBeginDrag}
            onScrollEndDrag={handleScrollEndDrag}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={handleScrollToIndexFailed}

        />
            </View>   

            <ScrollView>
      {Object.keys(genres).map((genreName, index) => (
        <View key={index}>
          <View style={styles.viewall}>
            <Text style={{
                fontSize: 23, // Ensure only one fontSize is set
                color: theme.textColor,
                paddingLeft: 16, // Padding should work
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                paddingTop: 10,
            }}>{genreName}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {moviesByGenre[genreName]?.slice(0, 20).map((movie, index) => (
              <TrendingMovie
                key={index}
                movieId={movie.id}
                imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                overview={movie.overview}
                rating={movie.vote_average.toFixed(1)}
                date={new Date(movie.release_date).getFullYear()}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
                    {/* Friends' Content */}

                    {/* {sortedContent.length > 0 && (
                        <View style={styles.friendsContent}>
                            <Text style={styles.sectionTitle}>Feed</Text>
                            {sortedContent.map((content, index) =>
                                content.post ? ( // Check if post property exists
                                    <Post
                                        key={index}
                                        postId={content.post.postId}
                                        uid={content.friend.uid}
                                        userInfo={userInfo}
                                        otherUserInfo={content.friend}
                                        username={content.post.name}
                                        userAvatar={content.friend.avatar}
                                        userHandle={`@${content.post.username}`}
                                        likes={content.post.likeCount ?? 0} // Default to 0 if likeCount is undefined or null
                                        comments={content.post.commentCount ?? 0} // Default to 0 if commentCount is undefined or null
                                        postTitle={content.post.postTitle}
                                        image={content.post.img}
                                        datePosted={formatDate(content.post.createdAt)} // Format the date
                                        preview={content.post.text}
                                        isUserPost={userInfo.userId == content.post.uid}
                                        handleCommentPress={handleCommentPress}
                                        Otheruid={content.friend.uid}
                                    />
                                ) : null // Render nothing if post property does not exist
                            )}
                            {sortedContent.map((content, index) =>
                                content.review ? ( // Check if review property exists
                                    <Review
                                        key={index}
                                        reviewId={content.review.reviewId}
                                        uid={userInfo.userId}
                                        userInfo={userInfo}
                                        otherUserInfo={content.friend}
                                        username={content.friend.username}
                                        userHandle={`${content.friend.username}`}
                                        userAvatar={content.friend.avatar}
                                        likes={content.review.likeCount ?? 0} // Update with actual likes data if available
                                        comments={content.review.commentCount ?? 0} // Update with actual comments data if available
                                        reviewTitle={content.review.reviewTitle}
                                        preview={content.review.text}
                                        dateReviewed={formatDate(content.review.createdAt)}
                                        movieName={content.review.movieTitle}
                                        image={content.review.img}
                                        rating={content.review.rating}
                                        isUserReview={userInfo.userId == content.review.uid}
                                        handleCommentPress={handleCommentPress}
                                        Otheruid={content.friend.uid}
                                    />
                                ) : null // Render nothing if review property does not exist
                            )}
                        </View>
                    )} */}
                </View>
            </VirtualizedList>
            <BottomHeader userInfo={userInfo} />
            <CommentsModal ref={bottomSheetRef} isPost={isPost} postId={selectedPostId} userId={userInfo.userId} username={userInfo.username} currentUserAvatar={userProfile ? userProfile.avatar : null} comments={comments} loadingComments={loadingComments} onFetchComments={fetchComments} />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    posterImage: {
        width: "100%",
        height: ITEM_SIZE * 1.2,
        resizeMode: "cover",
        borderRadius: 24,
        margin: 0,
        marginBottom: 10,
    }, line: {
        borderBottomColor: '#D3D3D3',  
        borderBottomWidth: 1,        
        marginVertical: 10,    
        paddingTop: 10,       
      },
    justforyou: {
        // textAlign: 'center',
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',

    },
    friendsContent: {
        paddingVertical: 4,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    trending :{
        paddingLeft:16,
        paddingTop: 2,
        fontFamily: 'Roboto',
        color: useTheme.textColor,
        fontSize: 23,
        fontWeight: 'bold',
        paddingTop: 10,
    },

    viewall: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
        paddingTop: 10,
        backgroundColor: '#fffff',
    },

    viewalltext: {
        fontFamily: 'Roboto',
    },
    container1: {
        position: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fffff',
        paddingTop: 10,
    },


});

export default Home;
