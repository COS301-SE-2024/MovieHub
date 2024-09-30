import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, RefreshControl, ActivityIndicator, Touchable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TabView, TabBar } from "react-native-tab-view";
import { Pressable } from "react-native";
import { Image } from "react-native";
import LikesTab from "../Components/FollowerLikesTab";
import PostsTab from "../Components/FollowerPostTab";
import WatchlistTab from "../Components/FollowerWatchlists";
import BottomHeader from "../Components/BottomHeader";
import CommentsModal from "../Components/CommentsModal";
import { useTheme } from "../styles/ThemeContext";
import { colors, themeStyles } from "../styles/theme";
import { getCommentsOfPost } from "../Services/PostsApiServices";
import { getUserProfile, followUser, unfollowUser, getFollowingCount, getFollowersCount, getFollowers, getFollowing} from "../Services/UsersApiService";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function FollowersProfilePage({ route }) {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('posts');
    const layout = useWindowDimensions();
    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);
    const [index, setIndex] = useState(0);
    const [isFollowing, setIsFollowing] = useState(route.params.isFollowing);
    const [userProfile, setUserProfile] = useState({});
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true); // Add this line
    const [selectedPostId, setSelectedPostId] = useState(null); // Add this line
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [isPost, setIsPost] = useState(false);

    const [routes] = useState([
        { key: "posts", title: "Posts" },
        { key: "likes", title: "Likes" },
        { key: "watchlist", title: "Watchlist" },
    ]);

    // const { userInfo } = route.params;

    const { userInfo, otherUserInfo } = route.params;
    // console.log("hai User Info:", userInfo.userId);
    const { username, userHandle, userAvatar, likes, saves, image, postTitle, preview, datePosted, uid } = otherUserInfo;

    const handlePressFollowers = async () => {
        try {
            const followers = await getFollowers(otherUserInfo.uid);
            navigation.navigate("FollowersPage", { 
                userInfo,
                followers,
                username: userProfile.name,
                userHandle: userProfile.username,
                userAvatar: userProfile.avatar
            });
        } catch (error) {
            console.error("Error fetching followers:", error);
        }
    };

    const handlePressFollowing = async () => {
        try {
            const following = await getFollowing(otherUserInfo.uid);
            navigation.navigate("FollowingPage", { 
                following,
                username: userProfile.name,
                userHandle: userProfile.username,
                userAvatar: userProfile.avatar
            });
        } catch (error) {
            console.error("Error fetching following:", error);
        }
    };

    const fetchData = async () => {
        try {
            const userId = otherUserInfo.uid;
            // console.log("Other User Info:", userId);
            const response = await getUserProfile(userId);
            setUserProfile(response);
            // console.log("Response:", response);

            if (response.followers && response.followers.low !== undefined) {
                setFollowers(response.followers.low);
            }

            if (response.following && response.following.low !== undefined) {
                setFollowing(response.following.low);
            }
            const followersCount = await getFollowersCount(userId);
            const followingCount = await getFollowingCount(userId);
            setFollowers(followersCount.followerCount);
            setFollowing(followingCount.followingCount);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false); // Set loading to false after data is fetched
        }
    };

    const fetchComments = async (postId) => {
        setLoadingComments(true);
        try {
            const response = await getCommentsOfPost(postId);
            // console.log("Fetched comments:", response.data);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments of post:", error.message);
            throw new Error("Failed to fetch comments of post");
        } finally {
            setLoadingComments(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData().finally(() => setRefreshing(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCommentPress = async (postId, isReview) => {
        setSelectedPostId(postId);
        setIsPost(!isReview);
        const response = await fetchComments(postId);
        // console.log("Comments:", response);
        bottomSheetRef.current?.present();
    };

    const handlePress = async () => {
        setFollowLoading(true); // Start the loading indicator
        try {
            const postBody = {
                followerId: userInfo.userId,
                followeeId: otherUserInfo.uid,
            };
    
            if (isFollowing) {
                await unfollowUser(postBody);
                setIsFollowing(false);
                if (followers > 0) {
                    setFollowers((prev) => prev - 1);
                }
            } else {
                await followUser(postBody);
                setIsFollowing(true);
                setFollowers((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
        } finally {
            setFollowLoading(false); // Stop the loading indicator
        }
    };
    

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        scrollContent: {
            flexGrow: 1,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 50,
        },
        followButton: {
            backgroundColor: theme.primaryColor,
            padding: 10,
            paddingHorizontal: 12,
            borderRadius: 5,
            width: 120,
        },
        followingButton: {
            backgroundColor: "#7b7b7b",
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            width: 140,
        },
        buttonText: {
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
        },
        buttonContainer: {
            alignItems: "center",
            marginTop: 20,
        },
        accountInfo: {
            alignItems: "center",
        },
        username: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.textColor,
        },
        userHandle: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.gray,
        },
        followInfo: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
            paddingHorizontal: 25,
        },
        number: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.textColor,
        },
        label: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.textColor,
            textTransform: "capitalize",
        },
        about: {
            marginTop: 25,
            marginHorizontal: 25,
        },
        tabContainer: {
            marginTop: 25,
            height: layout.height,
        },
        tabBar: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: theme.backgroundColor,
            elevation: 0,
            shadowOpacity: 0,
            marginTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: 'transparent',
        },
        tabItem: {
            paddingVertical: 10,
            paddingHorizontal: 35,
        },
        tabText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.textColor,
        },
        activeTab: {
            borderBottomWidth: 2,
            borderBottomColor: colors.primary,
        },
        indicator: {
            backgroundColor: colors.primary,
            borderRadius: 50,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.backgroundColor,
        },
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'posts':
                return <PostsTab userInfo={otherUserInfo} otherinfo={userInfo} userProfile={userProfile} handleCommentPress={handleCommentPress} />;
            case 'likes':
                return <LikesTab userInfo={otherUserInfo} userProfile={userProfile} handleCommentPress={handleCommentPress} orginalUserinfo={userInfo} />;
            case 'watchlist':
                return <WatchlistTab userInfo={otherUserInfo} userProfile={userProfile} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                scrollbarThumbColor="rgba(0, 0, 0, 0)"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.accountInfo}>
                    <Image
                        source={{ uri: userProfile.avatar }}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>{userProfile.name || "Itumeleng Moshokoa"}</Text>
                    <Text style={styles.userHandle}>@{userProfile.username}</Text>
                </View>
                <View style={styles.followInfo}>
                    <Text onPress={() => navigation.navigate("FollowersPage", { userInfo, otherUserInfo, userProfile, followers: followers })}>
                        <Text style={styles.number}>{followers} </Text>
                        <Text style={styles.label}>Followers</Text>
                    </Text>
                    <Text onPress={() => navigation.navigate("FollowingPage", { userInfo, otherUserInfo, userProfile, following: following })}>
                        <Text style={styles.number}>{following} </Text>
                        <Text style={styles.label}>Following</Text>
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={isFollowing ? styles.followingButton : styles.followButton} onPress={handlePress} disabled={followLoading}>
                        {followLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>{isFollowing ? "Following" : "Follow"}</Text>
                        )}
                    </Pressable>
                </View>
                <View style={styles.about}>
                    {userProfile.pronouns !== "Prefer not to say" && <Text style={{ color: theme.gray, paddingBottom: 5 }}>{userProfile.pronouns || "They/Them"}</Text>}
                    <Text style={{ color: theme.textColor }}>{userProfile.bio || "No bio here because they can't know me like that"}</Text>
                    <Text style={{ marginTop: 5 }}>
                        <Text style={{ fontWeight: "bold", color: theme.textColor }}>Favourite genres: </Text>
                        {userProfile.favouriteGenres && userProfile.favouriteGenres.length > 0 ? <Text style={{ color: theme.textColor }}>{userProfile.favouriteGenres.slice(0, 3).join(", ")}</Text> : <Text style={{ color: theme.textColor }}>Animation, True Crime</Text>}
                    </Text>
                </View>
                <View style={styles.tabBar}>
                    {['posts', 'likes', 'watchlist'].map((tab) => (
                        <Pressable
                            key={tab}
                            style={[styles.tabItem, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={styles.tabText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
                        </Pressable>
                    ))}
                </View>
                {renderTabContent()}
            </ScrollView>

            <BottomHeader userInfo={userInfo} />

            <CommentsModal
                ref={bottomSheetRef}
                isPost={isPost}
                postId={selectedPostId}
                userId={userInfo.userId}
                username={userInfo.username}
                currentUserAvatar={userInfo.avatar}
                comments={comments}
                loadingComments={loadingComments}
                onFetchComments={fetchComments}
            />
        </View>
    );
}