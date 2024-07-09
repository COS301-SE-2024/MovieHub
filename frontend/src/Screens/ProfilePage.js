import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Image } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import LikesTab from "../Components/LikesTab";
import PostsTab from "../Components/PostsTab";
import WatchlistTab from "../Components/Watchlist";
import BottomHeader from "../Components/BottomHeader";
import { getUserProfile } from "../Services/UsersApiService";
import * as SecureStore from "expo-secure-store";

import { colors, themeStyles } from "../styles/theme";
import { useTheme } from "../styles/ThemeContext";

function renderScene({ route }) {
    switch (route.key) {
        case "posts":
            return <PostsTab />;
        case "likes":
            return <LikesTab />;
        case "watchlist":
            return <WatchlistTab />;
    }
}

export default function ProfilePage({ route }) {
    const { theme } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "posts", title: "Posts" },
        { key: "likes", title: "Likes" },
        { key: "watchlist", title: "Watchlist" },
    ]);

    //  const route = useRoute();
    const { userInfo } = route.params;
    console.log("The users info in Profile Page: ", userInfo);


    const navigation = useNavigation();
    const handleEditProfile = () => {
        navigation.navigate("EditProfile", { userInfo });
    };

    let [userProfile, setUserProfile] = useState({});
    let [followers, setfollowers] = useState(0);
    let [following, setfollowing] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        // fetching data from api
        try {
            // //Check Users Token
            // const token = await SecureStore.getItemAsync('userToken');
            // if (!token) {
            //     throw new Error('No token found');
            // }

            const userId = userInfo.userId;
            console.log("/////About to fetch data//////");
            const response = await getUserProfile(userId);
            setUserProfile(response);

            if (response.followers && response.followers.low !== undefined) {
                setfollowers(response.followers.low);
            }

            if (response.following && response.following.low !== undefined) {
                setfollowing(response.following.low);
            }
            // console.log("24", following);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            // console.log("1", userProfile);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("User Profile:", userProfile);
        console.log("Followers:", followers);
    }, [userProfile, followers, following]);

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
            color: theme.gray,
            marginTop: 25,
            height: "110%",
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
    });

    return (
        // <ProfileHeader />
        <View style={{ flex: 1 }}>
            <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                <View style={styles.accountInfo}>
                    <Image
                        source={{
                            // uri: userProfile.profilePicture ======Getting error: No suitable URL request handler found for gs://moviehub-3ebc8.appspot.com/ProfilePictures/spiderman_point.webp=======
                            //     ? userProfile.profilePicture
                            uri: userProfile.avatar,
                        }}
                        style={styles.avatar}></Image>
                    <Text style={styles.username}>{userProfile.name ? userProfile.name : "Itumeleng Moshokoa"}</Text>
                    <Text style={styles.userHandle}>{userProfile.username ? userProfile.username : "Joyce"}</Text>
                </View>
                <View style={styles.followInfo}>
                    <Text>
                        <Text style={styles.number}>{followers} </Text>
                        <Text style={styles.label}>Followers</Text>
                    </Text>
                    <Text>
                        <Text style={styles.number}>{following} </Text>
                        <Text style={styles.label}>Following</Text>
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={themeStyles.button} onPress={handleEditProfile}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </Pressable>
                </View>
                <View style={styles.about}>
                    {userProfile.pronouns === "Prefer not to say" ? null : <Text style={{ color: theme.gray, paddingBottom: 5 }}>{userProfile.pronouns ? userProfile.pronouns : "They/Them"}</Text>}
                    <Text style={{ color: theme.textColor }}>{userProfile.bio ? userProfile.bio : "No bio here because they can't know me like that"}</Text>
                    <Text style={{ marginTop: 5 }}>
                        <Text style={{ fontWeight: "bold", color: theme.textColor }}>Favourite genres: </Text>
                        {userProfile.favouriteGenres && userProfile.favouriteGenres.length > 0 ? <Text style={{ color: theme.textColor }}>{userProfile.favouriteGenres.slice(0, 3).join(", ")}</Text> : <Text style={{ color: theme.textColor }}>Animation, True Crime</Text>}
                    </Text>
                </View>
                <View style={styles.tabContainer}>
                    <TabView 
                        navigationState={{ index, routes }} 
                        renderScene={renderScene} 
                        onIndexChange={setIndex} 
                        initialLayout={{ width: layout.width }} 
                        renderTabBar={(props) => 
                        <TabBar {...props} 
                            indicatorStyle={styles.indicator} labelStyle={styles.label} style={styles.tabBar} />
                    } />
                </View>
            </ScrollView>

            <BottomHeader />
        </View>
    );
}

// export default ProfilePage;
