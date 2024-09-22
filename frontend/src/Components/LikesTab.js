import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { getUserLikedPosts, getLikesOfPost, getLikesOfReview } from "../Services/LikesApiService";
import { getCountCommentsOfPost, getCountCommentsOfReview, removePost, removeReview } from "../Services/PostsApiServices";
import { FacebookLoader, InstagramLoader } from "react-native-easy-content-loader";
import Post from "./Post";
import Review from "./Review";


export default function LikesTab({ userInfo, userProfile, handleCommentPress }) {
    const [likedPosts, setLikedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

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

    const fetchLikedPosts = async () => {
        try {
            setLoading(true); // Set loading to true before fetch starts
            const userId = userInfo.userId;
            const response = await getUserLikedPosts(userId);

            if (response.data === null) {
                setLikedPosts([]);
            } else {
                const postsWithComments = await Promise.all(
                    response.data.map(async (item) => {
                        let commentsCount;
                        let likesCount;
                        if (item.labels[0] === "Post") {
                            commentsCount = (await getCountCommentsOfPost(item.properties.postId)).data;
                            likesCount = (await getLikesOfPost(item.properties.postId)).data;
                        } else if (item.labels[0] === "Review") {
                            commentsCount = (await getCountCommentsOfReview(item.properties.reviewId)).data;
                            likesCount = (await getLikesOfReview(item.properties.reviewId)).data;
                        }

                        const userHandle = "@" + item.properties.username;
                        return { ...item, commentsCount, likesCount, userHandle };
                    })
                );


                const uniquePostsWithComments = postsWithComments.filter(
                    (item, index, self) =>
                        index ===
                        self.findIndex((i) => {
                            // If it's a post, compare postId; if it's a review, compare reviewId
                            return item.labels[0] === "Post"
                                ? i.properties.postId === item.properties.postId
                                : i.properties.reviewId === item.properties.reviewId;
                        })
                );

                // Sort posts by createdAt in descending order (most recent first)
                uniquePostsWithComments.sort(
                    (a, b) => new Date(b.properties.createdAt) - new Date(a.properties.createdAt)
                );
    
                setLikedPosts(uniquePostsWithComments);
            }
        } catch (error) {
            console.log("Error fetching liked posts:", error);
            setLikedPosts([]);
        } finally {
            setLoading(false); // Set loading to false after fetch completes
        }
    };

    useEffect(() => {
        fetchLikedPosts();
    }, []);

    const handleDeletePost = async (postId) => {
        try {
            await removePost({ postId, uid: userInfo.userId });
            console.log("Post deleted successfully");
            setLikedPosts(likedPosts.filter(post => post.postId !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            Alert.alert("Error", "Failed to delete post");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await removeReview({ postId: reviewId, uid: userInfo.userId });
            setLikedPosts(likedPosts.filter(review => review.reviewId !== reviewId));
        } catch (error) {
            console.error("Error deleting review:", error);
            Alert.alert("Error", "Failed to delete review");
        }
    };

    if (loading) {
        return (
            <View style={{ paddingTop: 5 }}>
                <InstagramLoader active />
                <FacebookLoader active />
            </View>
        );
    }

    const styles = StyleSheet.create({
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
            color: theme.gray,
        },
    });

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {likedPosts.length === 0 ? (
                    <View style={styles.container}>
                        <Text style={styles.title}>You haven't liked any posts or reviews yet.</Text>
                        <Text style={styles.subtitle}>Start exploring and find reviews that resonate with you!</Text>
                    </View>
                ) : (
                    likedPosts.map((item, index) =>
                        item.labels[0] === "Post" ? (
                            <Post
                                key={index} // for uniqueness
                                postId={item.properties.postId}
                                uid={item.properties.uid}
                                username={item.properties.name}
                                userHandle={item.userHandle}
                                userAvatar={item.properties.avatar}
                                postTitle={item.properties.postTitle}
                                likes={item.likesCount ? item.likesCount : 0}
                                comments={item.commentsCount}
                                preview={item.properties.text}
                                saves={getRandomNumber(0, 18)}
                                image={item.properties.img || null}
                                isUserPost={item.properties.uid === userInfo.userId}
                                handleCommentPress={handleCommentPress}
                                datePosted={formatTimeAgoFromDB(item.properties.createdAt)}
                                onDelete={handleDeletePost}
                            />
                        ) : (
                            <Review
                                key={index} // for uniqueness
                                reviewId={item.properties.reviewId}
                                uid={item.properties.uid}
                                username={item.properties.name}
                                userHandle={item.userHandle}
                                userAvatar={item.properties.avatar}
                                reviewTitle={item.properties.reviewTitle}
                                likes={item.likesCount}
                                comments={item.commentsCount}
                                preview={item.properties.text}
                                saves={getRandomNumber(0, 18)}
                                image={item.properties.img || null}
                                isUserReview={item.properties.uid === userInfo.userId}
                                handleCommentPress={handleCommentPress}
                                dateReviewed={formatTimeAgoFromDB(item.properties.createdAt)}
                                movieName={item.properties.movieTitle}
                                rating={item.properties.rating}
                                onDelete={handleDeleteReview}
                            />
                        )
                    )
                )}
            </ScrollView>
        </View>
    );
}


