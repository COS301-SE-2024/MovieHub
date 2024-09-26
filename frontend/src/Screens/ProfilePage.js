import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, RefreshControl, ActivityIndicator, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import LikesTab from "../Components/LikesTab";
import PostsTab from "../Components/PostsTab";
import WatchlistTab from "../Components/Watchlist";
import BottomHeader from "../Components/BottomHeader";
import CommentsModal from "../Components/CommentsModal";
import { useTheme } from "../styles/ThemeContext";
import { colors, themeStyles } from "../styles/theme";
import { getCommentsOfPost, getCommentsOfReview } from "../Services/PostsApiServices";
import { useUser } from "../Services/UseridContext";
import { getUserProfile, getFollowingCount, getFollowersCount } from "../Services/UsersApiService";

export default function ProfilePage({ route }) {
    const { theme } = useTheme();
    const layout = useWindowDimensions();
    const [activeTab, setActiveTab] = useState('posts');
    const { userInfo } = route.params;
    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);
    const { setUserInfo } = useUser();
    const [userProfile, setUserProfile] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [isPost, setIsPost] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const fetchData = async () => {
        try {
            const userId = userInfo.userId;
            setUserInfo({ userId });
            const response = await getUserProfile(userId);
            setUserProfile(response);
            
            const followersCount = await getFollowersCount(userId);
            const followingCount = await getFollowingCount(userId);
            setFollowerCount(followersCount.followerCount);
            setFollowingCount(followingCount.followingCount);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (postId, isReview) => {
        setLoadingComments(true);
        try {
            const response = await (isReview ? getCommentsOfReview(postId) : getCommentsOfPost(postId));
            setComments(response.data);
        } catch (error) {
            console.error(`Error fetching comments of ${isReview ? 'review' : 'post'}:`, error.message);
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
        await fetchComments(postId, isReview);
        bottomSheetRef.current?.present();
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
        button: {
            backgroundColor: "#000",
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            width: 190,
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
                return <PostsTab userInfo={userInfo} userProfile={userProfile} handleCommentPress={handleCommentPress} />;
            case 'likes':
                return <LikesTab userInfo={userInfo} userProfile={userProfile} handleCommentPress={handleCommentPress} />;
            case 'watchlist':
                return <WatchlistTab userInfo={userInfo} userProfile={userProfile} />;
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
            <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />} scrollbarThumbColor="rgba(0, 0, 0, 0)" showsVerticalScrollIndicator={false} >
                <View style={styles.accountInfo}>
                    <Image
                        source={{ uri: userProfile.avatar }}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>{userProfile.name || "Itumeleng Moshokoa"}</Text>
                    <Text style={styles.userHandle}>@{userProfile.username || "Joyce"}</Text>
                </View>
                <View style={styles.followInfo}>
                    <Text onPress={() => navigation.navigate("FollowersPage", { userInfo, userProfile, followerCount })}>
                        <Text style={styles.number}>{followerCount} </Text>
                        <Text style={styles.label}>Followers</Text>
                    </Text>
                    <Text onPress={() => navigation.navigate("FollowingPage", { userInfo, userProfile, followingCount })}>
                        <Text style={styles.number}>{followingCount} </Text>
                        <Text style={styles.label}>Following</Text>
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={themeStyles.button} onPress={() => navigation.navigate("EditProfile", { userInfo, userProfile })}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </Pressable>
                </View>
                <View style={styles.about}>
                    {userProfile.pronouns !== "Prefer not to say" && <Text style={{ color: theme.gray, paddingBottom: 5 }}>{userProfile.pronouns || "They/Them"}</Text>}
                    {userProfile.bio && <Text style={{ color: theme.textColor }}>{userProfile.bio}</Text>}
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
                currentUserAvatar={userProfile.avatar}
                comments={comments}
                loadingComments={loadingComments}
                onFetchComments={fetchComments}
            />
        </View>
    );
}