
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import { getPostsOfUser, getReviewsOfUser, getCountCommentsOfPost, getCountCommentsOfReview, removePost, removeReview } from "../Services/PostsApiServices";
import { getLikesOfPost, getLikesOfReview } from "../Services/LikesApiService";
import { FacebookLoader, InstagramLoader } from "react-native-easy-content-loader";
import moment from "moment";
import Post from "./Post";
import Review from "./Review";

export default function PostsTab({ userInfo, userProfile, handleCommentPress, refreshing, onRefresh}) {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const formatTimeAgoFromDB = (date) => {
        return moment(date).fromNow(); // Using moment.js to format the date as 'X time ago'
    };

    const fetchPostsAndReviews = async () => {
        try {
            const userId = userInfo.userId;
            const [postsResponse, reviewsResponse] = await Promise.all([getPostsOfUser(userId), getReviewsOfUser(userId)]);

            //

            let postsWithComments = [];
            if (postsResponse.data) {
                postsWithComments = await Promise.all(
                    postsResponse.data.map(async (post) => {
                        const commentsResponse = await getCountCommentsOfPost(post.postId);
                        const likesResponse = await getLikesOfPost(post.postId);
                        const likesCount = likesResponse.data;
                        const commentsCount = commentsResponse.data; // Adjust according to the actual structure
                        return { ...post, commentsCount, likesCount, type: "post" };
                    })
                );
                // console.log("Loook ", postsWithComments);
            }

            let reviewsWithComments = [];
            if (reviewsResponse.data) {
                reviewsWithComments = await Promise.all(
                    reviewsResponse.data.map(async (review) => {
                        const commentsResponse = await getCountCommentsOfReview(review.reviewId);
                        const likesResponse = await getLikesOfReview(review.reviewId);
                        const likesCount = likesResponse.data;
                        const commentsCount = commentsResponse.data; // Adjust according to the actual structure
                        return { ...review, commentsCount, likesCount, type: "review" };
                    })
                );
            }

          
            let combinedData = [...postsWithComments, ...reviewsWithComments];

           
            combinedData = combinedData.filter(
                (item, index, self) =>
                    index ===
                    self.findIndex((i) => {
                       
                        return i.type === "post" ? i.postId === item.postId : i.reviewId === item.reviewId;
                    })
            );
    
           
            combinedData = combinedData.sort(
                (a, b) =>
                    new Date(b.createdAt || b.dateReviewed) - new Date(a.createdAt || a.dateReviewed)
            );
    
            setPosts(combinedData);

            
        } catch (error) {
            console.error("Error fetching posts and reviews:", error);
           
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchPostsAndReviews();
    }, [refreshing]);  



    if (refreshing) {
        console.log("refreshing");
        fetchPostsAndReviews();
    }

    const handleRefresh = async () => {
        console.log("handleRefresh");
        if (refreshing) {
            console.log("refreshing");
            fetchPostsAndReviews();
        }
    };

    // Function to handle post deletion and state update
    const handleDeletePost = async (postId) => {
        try {
            await removePost({ postId, uid: userInfo.userId });
            setPosts(posts.filter(post => post.postId !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            Alert.alert("Error", "Failed to delete post");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await removeReview({ reviewId: reviewId, uid: userInfo.userId });
            setPosts(posts.filter(review => review.reviewId !== reviewId));
        } catch (error) {
            console.error("Error deleting review:", error);
            Alert.alert("Error", "Failed to delete review");
        }
    };

    const styles = StyleSheet.create({
        outerContainer: {
            backgroundColor: theme.backgroundColor,
            flex: 1,
        },
        container: {
            backgroundColor: theme.backgroundColor,
            paddingHorizontal: 35,
            paddingTop: 55,
            textAlign: "center",
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 6,
            color: theme.textColor,
        },
        subtitle: {
            fontSize: 14,
            textAlign: "center",
            color: "#0f5bd1",
            fontWeight: "600",
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
    });

    if (loading) {
        return (
            <View style={{ paddingTop: 5 }}>
                <InstagramLoader active />
                <FacebookLoader active />
            </View>
        );
    }

    return (
        <View style={styles.outerContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {posts.length === 0 ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Share your thoughts!</Text>
                    <Pressable onPress={() => navigation.navigate("CreatePost", { userInfo })}>
                        <Text style={styles.subtitle}>Create your first post or review</Text>
                    </Pressable>
                </View>
            ) : (
                posts.map((item, index) =>
                    item.type === "post" ? (
                        <Post
                            key={index} // for uniqueness
                            postId={item.postId}
                            uid={item.uid}
                            username={item.name}
                            userHandle={item.username}
                            userAvatar={item.avatar}
                            postTitle={item.postTitle}
                            likes={item.likesCount}
                            comments={item.commentsCount || 0} /** Comments count */
                            preview={item.text}
                            saves={getRandomNumber(0, 18)}
                            image={item.img || null}
                            isUserPost={item.uid === userInfo.userId}
                            handleCommentPress={handleCommentPress}
                            datePosted={formatTimeAgoFromDB(item.createdAt)}
                            onDelete={handleDeletePost} // Pass handleDeletePost function
                        />
                    ) : (
                        <Review
                            key={index} // for uniqueness
                            reviewId={item.reviewId}
                            uid={item.uid}
                            username={item.name}
                            userHandle={item.username}
                            userAvatar={item.avatar}
                            likes={item.likesCount}
                            comments={item.commentsCount ? item.commentsCount : 0} /** Comments count */
                            image={item.img ? item.img : null}
                            saves={getRandomNumber(0, 18)}
                            reviewTitle={item.reviewTitle}
                            preview={item.text}
                            dateReviewed={formatTimeAgoFromDB(item.createdAt)}
                            isUserReview={item.uid === userInfo.userId}
                            handleCommentPress={handleCommentPress}
                            movieName={item.movieTitle}
                            rating={item.rating}
                            onDelete={handleDeleteReview}
                        />
                    )
                )
            )}
        </View>
    );
}