
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";
import { getPostsOfUser, getReviewsOfUser, getCountCommentsOfPost, getCountCommentsOfReview, removePost, removeReview } from "../Services/PostsApiServices";
import { getLikesOfPost, getLikesOfReview } from "../Services/LikesApiService";
import { FacebookLoader, InstagramLoader } from "react-native-easy-content-loader";
import Post from "./Post";
import Review from "./Review";

export default function PostsTab({ userInfo, userProfile, handleCommentPress }) {
    const { theme } = useTheme();
    const username = userProfile.name;
    const userHandle = "@" + userInfo.username;
    const avatar = userProfile.avatar;
    const navigation = useNavigation();

    const [posts, setPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const formatTimeAgoFromDB = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return `${seconds}s ago`;
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 30) return `${days}d ago`;
        if (months < 12) return `${months}mo ago`;
        return `${years}y ago`;
    };

    const fetchPostsAndReviews = async () => {
        try {
            const userId = userInfo.userId;
            const [postsResponse, reviewsResponse] = await Promise.all([getPostsOfUser(userId), getReviewsOfUser(userId)]);

            let postsWithComments = [];
            if (postsResponse.data) {
                postsWithComments = await Promise.all(
                    postsResponse.data.map(async (post) => {
                        const commentsResponse = await getCountCommentsOfPost(post.postId);
                        const likesResponse = await getLikesOfPost(post.postId);
                        const likesCount = likesResponse.data;
                        const commentsCount = commentsResponse.data; // Adjust according to the actual structure
                        console.log("combined1 data",commentsCount);
                        return { ...post, commentsCount, likesCount, type: "post" };
                    })
                );
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

            // Combine posts and reviews and sort by date
            const combinedData = [...postsWithComments, ...reviewsWithComments].sort((a, b) => new Date(b.createdAt || b.dateReviewed) - new Date(a.createdAt || a.dateReviewed));

            setPosts(combinedData);

            
        } catch (error) {
            console.error("Error fetching posts and reviews:", error);
            // Handle error state or retry logic
        } finally {
            setLoading(false); // Set loading to false after fetch completes
        }
    };

    

    useEffect(() => {
        fetchPostsAndReviews();
    }, []);

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
        <View style={styles.outerContainer}>
            {posts.length === 0 ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Share your thoughts!</Text>
                    <Pressable onPress={() => navigation.navigate("CreatePost", { userInfo })}>
                        <Text style={styles.subtitle}>Create your first post</Text>
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