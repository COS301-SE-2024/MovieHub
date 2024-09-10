import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import BottomHeader from '../Components/BottomHeader';
import NonFollowerPost from '../Components/NonFollowerPost';
import CategoriesFilters from '../Components/CategoriesFilters';
import ExploreHub from '../Components/ExploreHub';
import { getFriendsOfFriendsContent, getRandomUsersContent } from '../Services/ExploreApiService';
import { FacebookLoader, InstagramLoader } from 'react-native-easy-content-loader';
import { getCommentsOfPost, getCommentsOfReview, getCountCommentsOfPost, getCountCommentsOfReview } from "../Services/PostsApiServices"; // Import comment count functions
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
                // Fetch friends of friends' content
                const friendsContent = await getFriendsOfFriendsContent(userInfo);
                setFriendsOfFriendsContent(friendsContent);

                // Now fetch random users' content after the first call completes
                const randomContent = await getRandomUsersContent(userInfo);
                setRandomUsersContent(randomContent);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchContent();
    }, [userInfo]);

    const handleOpenHub = () => {
        navigation.navigate("HubScreen", { userInfo });
    };

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
                    {friendsOfFriendsContent.map((item, index) => {
                        if (!item.fof.postId) return null;
                        <NonFollowerPost
                            key={`fof-${index}`}
                            postId={item.post.postId}
                            userInfo={userInfo} // Current user's info
                            otherUserInfo={item.fof} // Friend of friend's info
                            uid={item.fof.uid} // Friend of friend's uid
                            username={item.fof.username}
                            userHandle={item.fof.name}
                            userAvatar={item.fof.avatar ? item.fof.avatar : null}
                            likes={item.post.likes ? item.post.likes : 0}
                            comments={item.post.comments ? item.post.comments : 0}
                            saves={item.post ? item.post.saves : 0}
                            image={item.post ? item.post.img : null}
                            postTitle={item.post ? item.post.postTitle : 'No Title'}
                            preview={item.post ? item.post.text : 'No Preview'}
                            datePosted={item.post ? item.post.createdAt : 'Unknown Date'}
                            isUserPost={item.uid === userInfo.userId}
                            handleCommentPress={handleCommentPress}
                        />
                    })}
                    {randomUsersContent.map((item, index) => (
                        <NonFollowerPost
                            key={`random-${index}`}
                            postId={item.post.postId}
                            userInfo={userInfo} // Current user's info
                            otherUserInfo={item.user}
                            username={item.user.username}
                            userHandle={item.user.name}
                            userAvatar={item.user.avatar ? item.user.avatar : null}
                            likes={item.post.likes ? item.post.likes : 0}
                            comments={item.post.comments ? item.post.comments : 0}
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

});
