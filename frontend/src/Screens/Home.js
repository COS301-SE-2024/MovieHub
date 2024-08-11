import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, Animated, Platform, Image, Dimensions, FlatList, Pressable } from "react-native";

import TrendingMovie from "../Components/TrendingMovies";
import { useNavigation } from "@react-navigation/native";
import { getMovies } from "../api";
import { getFriendsContent } from "../Services/ExploreApiService";
import { getLikesOfReview, getLikesOfPost } from "../Services/LikesApiService";
import { getCountCommentsOfPost, getCountCommentsOfReview } from "../Services/PostsApiServices"; // Import comment count functions

import Svg, { Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

import BottomHeader from "../Components/BottomHeader";
import Genres from "../Components/Genres";
import Rating from "../Components/Rating";
import Post from "../Components/Post";
import Review from "../Components/Review";
import HomeHeader from "../Components/HomeHeader";
import moment from "moment";

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const { width, height } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Loading = () => (
    <View style={styles.loadingContainer}>
        <Text style={styles.paragraph}>Loading...</Text>
    </View>
);

const Backdrop = ({ movies, scrollX }) => {
    return (
        <View style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}>
            <FlatList
                data={movies.reverse()}
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
                colors={["rgba(0, 0, 0, 0)", "white"]}
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
    const { userInfo } = route.params;
    const navigation = useNavigation();
    const [movies, setMovies] = useState([]);
   // const [friendsContent, setFriendsContent] = useState([]);
    const [sortedContent, setSortedContent] = useState([]);
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movies = await getMovies();
                const friendsData = await getFriendsContent(userInfo);
                // Extract posts and reviews
                const { posts, reviews } = friendsData;

                // Combine posts and reviews
                const combinedContent = [
                    ...posts.map(post => ({ ...post, type: 'post' })),
                    ...reviews.map(review => ({ ...review, type: 'review' }))
                ];

                // Sort combined content by createdAt in descending order
                const sortedContent = combinedContent.sort((a, b) => new Date(b.post?.createdAt || b.review?.createdAt) - new Date(a.post?.createdAt || a.review?.createdAt));

                // Fetch likes for each post and review
                const enrichedContent = await Promise.all(
                    sortedContent.map(async (content) => {
                        if (content.type === 'post') {
                            const likes = await getLikesOfPost(content.post.postId);
                            const comments = await getCountCommentsOfPost(content.post.postId);
                            console.log("Post likes: ", likes.data);
                            console.log("Post comments: ", comments.data);
                            return { ...content, post: { ...content.post, likeCount: likes.data, commentCount: comments.data } };
                        }
                        if (content.type === 'review') {
                            const likes = await getLikesOfReview(content.review.reviewId);
                            const comments = await getCountCommentsOfReview(content.review.reviewId);
                            console.log("Review likes: ", likes.data);
                            console.log("Review comments: ", comments.data);
                            return { ...content, review: { ...content.review, likeCount: likes.data, commentCount: comments.data } };
                        }
                        return content;
                    })
                );

                setMovies([{ key: "empty-left" }, ...movies, { key: "empty-right" }]);
               // setFriendsContent(sortedFriendsContent);
                setSortedContent(enrichedContent);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);


    if (movies.length === 0 || sortedContent.length === 0) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <VirtualizedList style={{ flex: 1 }}>
                <View style={styles.container}>
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
                                                backgroundColor: "white",
                                                borderRadius: 34,
                                            }}>
                                            <Image source={{ uri: item.poster }} style={styles.posterImage} />
                                            <Text style={{ fontSize: 24 }} numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                            <Rating rating={item.rating} />
                                            <Genres genres={item.genres} />
                                            <Text style={{ fontSize: 12 }} numberOfLines={3}>
                                                {item.description}
                                            </Text>
                                            <Pressable onPress={() => navigation.navigate("MovieDescriptionPage", { ...movieDetails })}>
                                                <Text style={{ fontSize: 12, fontWeight: "500", color: "blue" }}>Read more</Text>
                                            </Pressable>
                                        </Animated.View>
                                    </Pressable>
                                </View>
                            );
                        }}
                    />
                    {/* Friends' Content */}
                    <View style={styles.friendsContent}>
                        <Text style={styles.sectionTitle}>Feed</Text>
                        {sortedContent.map((content, index) => (
                            content.post ? ( // Check if post property exists
                                <Post
                                    key={index}
                                    postId={content.post.postId}
                                    uid={content.friend.uid}
                                    username={content.friend.username}
                                    userAvatar={content.friend.avatar}
                                    userHandle={`@${content.friend.username}`}
                                    likes={content.post.likeCount ?? 0} // Default to 0 if likeCount is undefined or null
                                    comments={content.post.commentCount ?? 0} // Default to 0 if commentCount is undefined or null
                                    postTitle={content.post.postTitle}
                                    datePosted={formatDate(content.post.createdAt)} // Format the date
                                    preview={content.post.text}
                                    isUserPost={userInfo.userId == content.post.uid}
                                />
                            ) : null // Render nothing if post property does not exist
                        ))}
                        {sortedContent.map((content, index) => (
                            content.review ? ( // Check if review property exists
                                <Review
                                    key={index}
                                    reviewId={content.review.reviewId}
                                    uid={content.friend.uid}
                                    username={content.friend.username}
                                    userHandle={`@${content.friend.username}`}
                                    userAvatar={content.friend.avatar}
                                    likes={content.review.likeCount ?? 0} // Update with actual likes data if available
                                    comments={content.review.commentCount ?? 0} // Update with actual comments data if available
                                    reviewTitle={content.review.reviewTitle}
                                    preview={content.review.text}
                                    dateReviewed={formatDate(content.review.createdAt)}
                                    movieName={content.review.movieTitle}
                                    rating={content.review.rating}
                                    isUserReview={userInfo.userId==content.review.uid}
                                />
                            ) : null // Render nothing if review property does not exist
                        ))}
                    </View>
                </View>
            </VirtualizedList>
            <BottomHeader userInfo={userInfo} />
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
    },
    friendsContent: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
});

export default Home;
