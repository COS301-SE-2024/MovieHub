import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity, StatusBar, Animated, Platform, Image, Dimensions, FlatList, Pressable } from "react-native";

import TrendingMovie from "../Components/TrendingMovies";
import BottomHeader from "../Components/BottomHeader";
import { useNavigation } from "@react-navigation/native";
import { getMovies } from "../api";
import Genres from "../Components/Genres";
import Rating from "../Components/Rating";
import Svg, { Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

import { getPopularMovies, getMoviesByGenre } from "../Services/TMDBApiService";
import Post from "../Components/Post";
import HomeHeader from "../Components/HomeHeader";

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

const Home = ({ route }) => {
    //Use userInfo to personlise a users homepage
    const { userInfo } = route.params;
    const navigation = useNavigation();
    const [movies, setMovies] = React.useState([]);
    const scrollX = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        const fetchData = async () => {
            const movies = await getMovies();
            // Add empty items to create fake space
            // [empty_item, ...movies, empty_item]
            setMovies([{ key: "empty-left" }, ...movies, { key: "empty-right" }]);
        };

        if (movies.length === 0) {
            fetchData(movies);
        }
    }, [movies]);

    if (movies.length === 0) {
        return <Loading />;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <HomeHeader />
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
                            <View style={{ width: ITEM_SIZE, paddingBottom:0 }}>
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
                {/* Posts */}
                <View>
                    <Text style={{ fontSize: 24, fontWeight: "bold", paddingLeft: 16, paddingBottom: 10, textAlign: "center", fontFamily: "Roboto" }}>Latest Posts</Text>
                    <Post postId={1} uid={1} username={"test"} userAvatar={"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"} userHandle={"@test"} likes={0} comments={0} postTitle={"Fake title"} datePosted={"5h ago"} preview={"lorem ipsum dolor sit amet"} />
                    <Post postId={1} uid={1} username={"test"} userAvatar={"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"} userHandle={"@test"} likes={0} comments={0} postTitle={"Fake title"} datePosted={"5h ago"} preview={"lorem ipsum dolor sit amet"} />
                    <Post postId={1} uid={1} username={"test"} userAvatar={"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"} userHandle={"@test"} likes={0} comments={0} postTitle={"Fake title"} datePosted={"5h ago"} preview={"lorem ipsum dolor sit amet"} />
                </View>
            </ScrollView>
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
});

export default Home;
