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
import { getUserProfile, followUser, unfollowUser } from "../Services/UsersApiService";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function FollowersProfilePage({ route }) {
    console.log("FollowerPostTab - Other User Info:", otherUserInfo);
    const { theme } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "posts", title: "Posts" },
        { key: "likes", title: "Likes" },
        { key: "watchlist", title: "Watchlist" },
    ]);

    // const { userInfo } = route.params;
    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);

    const { userInfo, otherUserInfo } = route.params;
    // console.log("hai User Info:", otherUserInfo);
    const { username, userHandle, userAvatar, likes, saves, image, postTitle, preview, datePosted, uid } = otherUserInfo;

    console.log("FollowerProfilepage -- Other User Info:", otherUserInfo);

    const [userProfile, setUserProfile] = useState({});
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true); // Add this line
    const [selectedPostId, setSelectedPostId] = useState(null); // Add this line
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const handlePressFollowers = () => {
        navigation.navigate("FollowersPage", { route,username, userHandle, userAvatar, likes, saves, image, postTitle, preview, datePosted });
    };

    const handlePressFollowing = () => {
        navigation.navigate("FollowingPage", { route,username, userHandle, userAvatar, likes, saves, image, postTitle, preview, datePosted } );
    };

    const fetchData = async () => {
        try {
            const userId = otherUserInfo.uid;
            console.log("Other User Info:", userId);
            const response = await getUserProfile(userId);
            setUserProfile(response);
            console.log("Response:", response);

            if (response.followers && response.followers.low !== undefined) {
                setFollowers(response.followers.low);
            }

            if (response.following && response.following.low !== undefined) {
                setFollowing(response.following.low);
            }
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

    const handleCommentPress = async (postId) => {
        setSelectedPostId(postId);
        const response = await fetchComments(postId);
        // console.log("Comments:", response);
        bottomSheetRef.current?.present();
    };

    const [isFollowing, setIsFollowing] = useState(false);

    const handlePress = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(otherUserInfo.userId, userProfile.id);
                setIsFollowing(false);
                setFollowers(prev => prev - 1);
            } else {
                await followUser(userInfo.userId, userProfile.id);
                setIsFollowing(true);
                setFollowers(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
        }
    };

    

    const styles = StyleSheet.create({
        container: {
            backgroundColor: "#fff",
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
        tabContainer: {
            marginTop: 25,
            height: layout.height,
        },
        tabBar: {
            backgroundColor: theme.backgroundColor,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
        },
        indicator: {
            backgroundColor: colors.primary,
            borderRadius: 50,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.backgroundColor,
        },
    });

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "posts": return <PostsTab userInfo={otherUserInfo} userProfile={userProfile} />;
            case "likes":
                return <LikesTab userInfo={otherUserInfo} userProfile={userProfile} handleCommentPress={handleCommentPress} />;
            case "watchlist":
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
        <View style={{ flex: 1 }}>
            <ScrollView
                style={[styles.container, { backgroundColor: theme.backgroundColor }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
                <View style={styles.accountInfo}>
                    <Image
                        source={{
                            uri: userProfile.avatar,
                        }}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>{userProfile.name || "Itumeleng Moshokoa"}</Text>
                    <Text style={styles.userHandle}>@{userProfile.username}</Text>
                </View>
                <View style={styles.followInfo}>
                <TouchableOpacity onPress={handlePressFollowers}>
                    <Text>
                        <Text style={styles.number}>{followers} </Text>
                        <Text style={styles.label}>Followers</Text>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePressFollowing}>
                    <Text>
                        <Text style={styles.number}>{following} </Text>
                        <Text style={styles.label}>Following</Text>
                    </Text>
                </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                <Pressable style={themeStyles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                </Pressable>
                </View>
                <View style={styles.about}>
                    {userProfile.pronouns !== "Prefer not to say" && (
                        <Text style={{ color: theme.gray, paddingBottom: 5 }}>
                            {userProfile.pronouns || "They/Them"}
                        </Text>
                    )}
                    <Text style={{ color: theme.textColor }}>
                        {userProfile.bio || "No bio here because they can't know me like that"}
                    </Text>
                    <Text style={{ marginTop: 5 }}>
                        <Text style={{ fontWeight: "bold", color: theme.textColor }}>Favourite genres: </Text>
                        {userProfile.favouriteGenres && userProfile.favouriteGenres.length > 0 ? (
                            <Text style={{ color: theme.textColor }}>{userProfile.favouriteGenres.slice(0, 3).join(", ")}</Text>
                        ) : (
                            <Text style={{ color: theme.textColor }}>Animation, True Crime</Text>
                        )}
                    </Text>
                </View>
                <View style={styles.tabContainer}>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={(props) => (
                            <TabBar
                                {...props}
                                indicatorStyle={styles.indicator}
                                labelStyle={styles.label}
                                style={styles.tabBar}
                            />
                        )}
                    />
                </View>
            </ScrollView>

            <BottomHeader userInfo={userInfo} />
            
            <CommentsModal    
                ref={bottomSheetRef} 
                postId={selectedPostId} 
                userId={otherUserInfo.userId}
                username={otherUserInfo.username}
                currentUserAvatar={userProfile.avatar}
                comments={comments}
                loadingComments={loadingComments}
                onFetchComments={fetchComments}
            />
        </View>
    );
}