import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { getUserLikedPosts, getLikesOfPost, getLikesOfReview } from "../Services/LikesApiService";
import { getCountCommentsOfPost, getCountCommentsOfReview, removePost, removeReview } from "../Services/PostsApiServices";
import { FacebookLoader, InstagramLoader } from "react-native-easy-content-loader";
import Post from "./Post";
import Review from "./Review";

export default function FollowerLikesTab({ userInfo, userProfile, handleCommentPress, orginalUserinfo}) {
    const [likedPosts, setLikedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    console.log("followers likes",userInfo);
    console.log("followers profile",userProfile);

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

    console.log("whats going on",orginalUserinfo);

    const fetchLikedPosts = async () => {
        try {
            setLoading(true); // Set loading to true before fetch starts
            const userId = userInfo.uid;
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
                            console.log("item",item);
                            commentsCount = (await getCountCommentsOfReview(item.properties.reviewId)).data;
                            likesCount = (await getLikesOfReview(item.properties.reviewId)).data;
                        }

                        const userHandle = "@" + item.properties.username;
                        return { ...item, commentsCount, likesCount, userHandle };
                    })
                );

                // Sort posts by createdAt in descending order (most recent first)
                postsWithComments.sort((a, b) => new Date(b.properties.createdAt) - new Date(a.properties.createdAt));
                // console.log("postWithComments", postsWithComments);
                setLikedPosts(postsWithComments);
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
            fontSize: 16,
            color: theme.textColor,
            textAlign: "center",
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
                        <Text style={styles.title}>No liked posts</Text>
                    </View>
                ) : (
                    likedPosts.map((item, index) =>
                        item.labels[0] === "Post" ? (
                            <Post
                                key={index} // for uniqueness
                                postId={item.properties.postId}
                                uid={orginalUserinfo.userId}
                                username={item.properties.name}
                                userHandle={item.userHandle}
                                userAvatar={item.properties.avatar}
                                postTitle={item.properties.postTitle}
                                likes={item.likesCount}
                                comments={item.commentsCount}
                                preview={item.properties.text}
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
                                uid={orginalUserinfo.userId}
                                username={item.properties.name}
                                userHandle={item.userHandle}
                                userAvatar={item.properties.avatar}
                                reviewTitle={item.properties.reviewTitle}
                                likes={item.likesCount}
                                comments={item.commentsCount}
                                preview={item.properties.text}
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

