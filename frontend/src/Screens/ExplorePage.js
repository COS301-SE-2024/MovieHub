import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList,TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import BottomHeader from '../Components/BottomHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import NonFollowerPost from '../Components/NonFollowerPost';
import CategoriesFilters from '../Components/CategoriesFilters';
import ExploreHub from '../Components/ExploreHub';
import { getFriendsOfFriendsContent, getRandomUsersContent } from '../Services/ExploreApiService';
import { FacebookLoader, InstagramLoader } from 'react-native-easy-content-loader';
import { getCommentsOfPost, getCommentsOfReview, getCountCommentsOfPost, getCountCommentsOfReview } from "../Services/PostsApiServices"; 
import { getLikesOfReview, getLikesOfPost } from "../Services/LikesApiService";
import CommentsModal from '../Components/CommentsModal';

export default function ExplorePage({ route }) {
    const { userInfo } = route.params;
    const navigation = useNavigation();

    const [friendsOfFriendsContent, setFriendsOfFriendsContent] = useState([]);
    const [randomUsersContent, setRandomUsersContent] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const bottomSheetRef = useRef(null);
    const [userProfile, setUserProfile] = useState(null);
    const [movies, setMovies] = useState([]);
    const [isPost, setIsPost] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null); 

    const rooms = [
        { movieTitle: "Another Room", roomName: "Another Room", users: 128, live: true },
        { roomName: "feel like ranting?", users: 372 },
        { movieTitle: "Marley & Me", roomName: "The Lover's Club", users: 34, live: true },
        { roomName: "JSON's Room", users: 56 },
    ];

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const friendsContent = await getFriendsOfFriendsContent(userInfo);


                const enrichedFriendsContent = await Promise.all(
                    friendsContent.map(async (content) => {
                        // console.log("friendscontnet:", content.post);
                        if (content.post) {
                            const likes = await getLikesOfPost(content.post.postId);
                            const comments = await getCountCommentsOfPost(content.post.postId);
                            // console.log("Post Likes:", likes.data); 
                            // console.log("Post Comments:", comments.data); 
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
    
                setRandomUsersContent(enrichedRandomContent);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };
    
        fetchContent();
    }, [userInfo]);


    const handleOpenHub = () => {
        navigation.navigate("HubScreen", { userInfo });
    };

        console.log("friendsContent",friendsOfFriendsContent)
        console.log("randomContent",randomUsersContent)

    const fetchComments = async (postId, isReview) => {
        setLoadingComments(true);
        if (isReview) {
            try {
                const response = await getCommentsOfReview(postId);
                setComments(response.data);
                // console.log("Fetched comments of reviews:", response.data);
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
                // console.log("Fetched comments:", response.data);
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
        // console.log("Comments:", response);
        bottomSheetRef.current?.present();
    };


    return (
        <View style={styles.container}>
            <ScrollView>

            <View style={styles.searchBarSize}>
            <View style={styles.searchBar}>
                <Icon name="search" size={30} style={{ marginRight: 8 }} />

                <TextInput style={styles.input} placeholder="Search by username or name" placeholderTextColor={"gray"} onChangeText={(text) => handleSearch(text)} />
            </View>
            </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <CategoriesFilters categoryName="Top Reviews" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Latests Posts" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Action" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Comedy" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Drama" selectedCategory={selectedCategory} />
                </ScrollView>

                <View style={styles.header}>
                    <Text style={styles.heading}>The Hub</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" style={{ marginLeft: "auto" }}  onPress={handleOpenHub} />
                </View>

                <FlatList 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    data={rooms} 
                    renderItem={({ item }) => <ExploreHub userInfo={userInfo} roomData={item} />} 
                    keyExtractor={(item, index) => index.toString()} 
                    contentContainerStyle={styles.cardRow}
                />

                {/** POSTS */}
                <InstagramLoader active loading={friendsOfFriendsContent.length === 0 && randomUsersContent.length === 0} />
                <FacebookLoader active loading={friendsOfFriendsContent.length === 0 && randomUsersContent.length === 0} />
                <FacebookLoader active loading={friendsOfFriendsContent.length === 0 && randomUsersContent.length === 0} />
                <View style={styles.postsContainer}>
                    {friendsOfFriendsContent.map((item, index) => (
                        <NonFollowerPost
                            key={`fof-${index}`}
                            postId={item.post ? item.post.uid : null} // Handle null item.post
                            userInfo={userInfo} // Current user's info
                            otherUserInfo={item.fof} // Friend of friend's info
                            uid={item.fof.uid} // Friend of friend's uid
                            username={item.fof.username}
                            userHandle={item.fof.name}
                            userAvatar={item.fof.avatar ? item.fof.avatar : null}
                            likes={item.post.likeCount ?? 0}
                            comments={item.post.commentCount ?? 0}
                            saves={item.post ? item.post.saves : 0}
                            image={item.post ? item.post.img : null}
                            postTitle={item.post ? item.post.postTitle : 'No Title'}
                            preview={item.post ? item.post.text : 'No Preview'}
                            datePosted={item.post ? item.post.createdAt : 'Unknown Date'}
                            isUserPost={item.uid === userInfo.userId}
                            handleCommentPress={handleCommentPress}
                        />
                    ))}
                    {randomUsersContent.map((item, index) => (
                        <NonFollowerPost
                            key={`random-${index}`}
                            postId={item.post.postId}
                            userInfo={userInfo} // Current user's info
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
                            datePosted={item.post ? item.post.createdAt : 'Unknown Date'}
                            isUserPost={item.uid === userInfo.userId}
                            handleCommentPress={handleCommentPress}
                        />
                    ))}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVerical: 10,
        backgroundColor: '#ffffff',
        
    },
    searchBar: {
        flexDirection: "row",
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        width: '95%',
        padding: 10,
        marginTop: 15,
        alignItems: "center",
        
    },
    searchBarSize: {
        alignItems: "center",   
    },
    heading: {
        fontFamily: "Roboto",
        color: "#000000",
        fontSize: 23,
        fontWeight: "bold",
        paddingLeft: 10,
        paddingTop: 1,
    },
    header: {
        flexDirection: 'row',
        paddingTop: 15,
        padding: 10,
    },
    postsContainer: {
    },
    input: {
        flex: 1,
        marginRight: 30,
    },

});
