import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import BottomHeader from '../Components/BottomHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NonFollowerPost from '../Components/NonFollowerPost';
import NonFollowerReview from '../Components/NonFollowerReview';
import { getFriendsOfFriendsContent, getRandomUsersContent } from '../Services/ExploreApiService';
import { InstagramLoader } from 'react-native-easy-content-loader';
import { getCommentsOfPost, getCommentsOfReview, getCountCommentsOfPost, getCountCommentsOfReview } from "../Services/PostsApiServices"; 
import { getLikesOfReview, getLikesOfPost } from "../Services/LikesApiService";
import {  searchUser  } from "../Services/UsersApiService";
import CommentsModal from '../Components/CommentsModal';
import { getRecentRooms, getPublicRooms, getRoomParticipantCount } from "../Services/RoomApiService";
import UserRoomCard from '../Components/UserRoomCard';
import FollowList from '../Components/FollowList';
import HubTabView from '../Components/HubTabView';
import { getFriendsContent } from "../Services/ExploreApiService"; // Add this if not already imported
import Post from "../Components/Post";  // To render posts
import Review from "../Components/Review";  // To render reviews
import moment from "moment";
import { useTheme } from '../styles/ThemeContext';
import SearchBar from '../Components/SearchBar';


export default function ExplorePage({ route }) {
    const { userInfo } = route.params;
    console.log(userInfo);
    const navigation = useNavigation();
    const {theme } = useTheme();
    const [friendsOfFriendsContent, setFriendsOfFriendsContent] = useState([]);
    const [randomUsersContent, setRandomUsersContent] = useState([]);
    const bottomSheetRef = useRef(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isPost, setIsPost] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null); 
    const [recentRooms, setRecentRooms] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [sortedContent, setSortedContent] = useState([]);

    const keywords = ["art", "city", "neon", "space", "movie", "night", "stars", "sky", "sunset", "sunrise"];

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const friendsContent = await getFriendsOfFriendsContent(userInfo);
                const enrichedFriendsContent = await Promise.all(
                    friendsContent.map(async (content) => {
                        if (content.post) {
                            const likes = await getLikesOfPost(content.post.postId);
                            const comments = await getCountCommentsOfPost(content.post.postId);
                            return { ...content, post: { ...content.post, likeCount: likes.data, commentCount: comments.data } };
                        }
                        if (content.review) {
                            const likes = await getLikesOfReview(content.review.reviewId);
                            const comments = await getCountCommentsOfReview(content.review.reviewId);
                            return { ...content, review: { ...content.review, likeCount: likes.data, commentCount: comments.data } };
                        }
                        return content;
                    })
                );
                setFriendsOfFriendsContent(enrichedFriendsContent);
    
                const randomContent = await getRandomUsersContent(userInfo);
                const enrichedRandomContent = await Promise.all( 
                    randomContent.map(async (content) => {
                        if (content.post) {
                            const likes = await getLikesOfPost(content.post.postId);
                            const comments = await getCountCommentsOfPost(content.post.postId);
                            return { ...content, post: { ...content.post, likeCount: likes.data, commentCount: comments.data } };
                        }
                        if (content.review) {
                            const likes = await getLikesOfReview(content.review.reviewId);
                            const comments = await getCountCommentsOfReview(content.review.reviewId);
                            return { ...content, review: { ...content.review, likeCount: likes.data, commentCount: comments.data } };
                        }
                        return content;
                    })
                );
                // sort by date 
                enrichedRandomContent.sort((a, b) => new Date(b.post?.createdAt || b.review?.createdAt) - new Date(a.post?.createdAt || a.review?.createdAt));
                setRandomUsersContent(enrichedRandomContent);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };
    
        fetchContent();
    }, [userInfo]);

    useFocusEffect(
        useCallback(() => {
            fetchRooms();
        }, [fetchRooms])
    );

    const formatDate = (date) => {
        return moment(date).fromNow(); // Using moment.js to format the date as 'X time ago'
    };
    
    const fetchFriendsContent = useCallback(async () => {
        try {
            const friendsData = await getFriendsContent(userInfo);
            const { posts, reviews } = friendsData;

            console.log("freinds content", posts);

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
            console.log("explore sorted content",sortedContent)
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

    const handleOpenHub = () => {
        navigation.navigate("HubScreen", { userInfo });
    };

    const fetchComments = async (postId, isReview) => {
        setLoadingComments(true);
        try {
            const response = await (isReview ? getCommentsOfReview(postId) : getCommentsOfPost(postId));
            setComments(response.data);
        } catch (error) {
            console.error(`Error fetching comments of ${isReview ? 'review' : 'post'}:`, error.message);
            throw new Error(`Failed to fetch comments of ${isReview ? 'review' : 'post'}`);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCommentPress = async (postId, isReview) => {
        setSelectedPostId(postId);
        setIsPost(!isReview);
        await fetchComments(postId, isReview);
        bottomSheetRef.current?.present();
    };

    const handleSearch = async (name) => {

        if (name.trim() === "") {
            setSearchResults([]); 
            return;
        }
        try {
            const response = await searchUser(name); 
            console.log(response);
            if (response.users) {
                console.log("we finna get crunk");
                setSearchResults(response.users);
            } else {
                console.loh("no we not")
                setSearchResults([]); 
            }
        } catch (error) {
            console.error("Error during search:", error.message);
            setSearchResults([]); 
        }
    };

    const renderUser = ({ item }) => (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={{ alignItems: "left" }}>
                    <Text style={styles.username}>{item.name}</Text>
                    <Text style={styles.userHandle}>{item.username}</Text>
                </View>
            </View>
            {item.avatar && <Image source={{ uri: item.avatar }} style={styles.postImage} />}
            <View style={styles.statsContainer}>
            </View>
        </View>
    );

    const fetchRooms = useCallback(async () => {
        try {
            const recentRoomsData = await getRecentRooms(userInfo.userId);
            if (recentRoomsData.length > 0) {
                const recentRoomsWithCounts = await Promise.all(
                    recentRoomsData.map(async (room) => {
                        const countResponse = await getRoomParticipantCount(room.roomId);
                        return {
                            ...room,
                            participantsCount: countResponse.participantCount || 0,
                        };
                    })
                );
                setRecentRooms(recentRoomsWithCounts);
            } else {
                const publicRoomsData = await getPublicRooms();
                if (publicRoomsData.length > 0) {
                    const recentRoomsWithCounts = await Promise.all(
                        publicRoomsData.map(async (room) => {
                            const countResponse = await getRoomParticipantCount(room.roomId);
                            return {
                                ...room,
                                participantsCount: countResponse.participantCount || 0,
                            };
                        })
                    );
                    setRecentRooms(recentRoomsWithCounts);
                }
            }
        } catch (error) {
            console.error("Failed to fetch recent rooms explore page:", error);
        }
    }, [userInfo.userId]);
    
    const renderRoomCard = ({ item }) => (
        <UserRoomCard
            roomName={item.roomName}
            users={item.participantsCount}
            live={item.roomType !== "Chat-only"}
            keyword={keywords[Math.floor(Math.random() * keywords.length)]}
            handlePress={() => navigation.navigate("ViewRoom", { userInfo, isUserRoom: item.isUserRoom, roomId: item.roomId })}
            coverImage={item.coverImage}
        />
    );

    const getRandomKeyword = () => {
        return keywords[Math.floor(Math.random() * keywords.length)];
    };

    const renderFollower = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Profile', { userInfo, otherUserInfo : item })} 
        >
            <FollowList 
                route={route}
                uid={item.uid}
                username={item.username}
                userHandle={item.name}
                userAvatar={item.avatar}
            />
        </TouchableOpacity>
    );

    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: 10,
            backgroundColor: '#ffffff',
        },
        header: {
            flexDirection: 'row',
            paddingTop: 15,
            padding: 10,
        },
        heading: {
            fontFamily: "Roboto",
            color: "#000000",
            fontSize: 23,
            fontWeight: "bold",
            paddingLeft: 10,
            paddingTop: 1,
            alignContent:'center'
        },
        postsContainer: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        roomList: {
            paddingHorizontal: 10,
        },
        divider: {
            height: 1,
            backgroundColor: "#ccc",
            marginVertical: 16,
        },
        friendsContent: {
            backgroundColor: theme.backgroundColor,
        }
    });    
    return (
        <View style={{ flex: 1, backgroundColor: useTheme.backgroundColor }}>
            <ScrollView>
            <SearchBar onChangeText={handleSearch} />

            {searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    // keyExtractor={(item) => item.uid}
                    renderItem={renderFollower}
                    showsVerticalScrollIndicator={false}
                />
            ) : null}

                <View style={styles.postsContainer}>
                    <HubTabView>
                        <View>
                            {/* Friends' Content */}
                            <InstagramLoader active loading={sortedContent.length === 0} />
                            <InstagramLoader active loading={sortedContent.length === 0} />
                            {sortedContent.length > 0 && (
                                <View style={styles.friendsContent}>
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
                                                userHandle={`${content.post.username}`}
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
                                                username={content.review.name}
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
                    )}    
                        </View>
                        <View>
                            {/* Discover Tab Content */}
                            <InstagramLoader active loading={randomUsersContent.length === 0} />
                            <InstagramLoader active loading={randomUsersContent.length === 0} />
                            {randomUsersContent.map((item, index) => (
                                <NonFollowerPost
                                    key={`random-${index}`}
                                    postId={item.post.postId}
                                    userInfo={userInfo}
                                    otherUserInfo={item.user}
                                    username={item.user.username}
                                    userHandle={item.user.name}
                                    userAvatar={item.user.avatar ? item.user.avatar : null}
                                    likes={item.post.likeCount ?? 0}
                                    comments={item.post.commentCount ?? 0}
                                    saves={item.post ? item.post.saves : 0}
                                    image={item.post ? item.post.img : null}
                                    postTitle={item.post ? item.post.postTitle : 'No Title'}
                                    preview={item.post ? item.post.text : 'No Preview'}
                                    datePosted={item.post.createdAt ? formatDate(item.post.createdAt) : 'Unknown Date'}
                                    isUserPost={item.uid === userInfo.userId}
                                    handleCommentPress={handleCommentPress}
                                />
                            ))}

                            {/* For You Tab Content */}
                            {/* <InstagramLoader active loading={friendsOfFriendsContent.length === 0} /> */}
                            {friendsOfFriendsContent.map((item, index) => {
                                if (!item.fof.postId) return null;
                                return (
                                    <NonFollowerPost
                                        key={`fof-${index}`}
                                        postId={item.post ? item.post.uid : null}
                                        userInfo={userInfo}
                                        otherUserInfo={item.fof}
                                        uid={item.fof.uid}
                                        username={item.fof.username}
                                        userHandle={item.fof.name}
                                        userAvatar={item.fof.avatar ? item.fof.avatar : null}
                                        likes={item.post.likes ? item.post.likes : 0}
                                        comments={item.post.comments ? item.post.comments : 0}
                                        saves={item.post ? item.post.saves : 0}
                                        image={item.post ? item.post.img : null}
                                        postTitle={item.post ? item.post.postTitle : 'No Title'}
                                        preview={item.post ? item.post.text : 'No Preview'}
                                        datePosted={item.post.createdAt ? formatDate(item.post.createdAt) : 'Unknown Date'}
                                        isUserPost={item.uid === userInfo.userId}
                                        handleCommentPress={handleCommentPress}
                                    />
                                );
                            })}
                        </View>
                    </HubTabView>
                </View>
            </ScrollView>
            <BottomHeader userInfo={userInfo} />
            <CommentsModal    
                ref={bottomSheetRef} 
                isPost={isPost}
                postId={selectedPostId} 
                userId={userInfo.userId}
                username={userInfo.username}
                currentUserAvatar={userProfile ? userProfile.avatar : null}
                comments={comments}
                loadingComments={loadingComments}
                onFetchComments={fetchComments}
            />
        </View>
    );
}


