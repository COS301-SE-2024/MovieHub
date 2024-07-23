import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, useWindowDimensions, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Image } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { EditProfile } from "./EditProfile";
import LikesTab from "../Components/LikesTab";
import PostsTab from "../Components/PostsTab";
import WatchlistTab from"../Components/Watchlist";
import BottomHeader from "../Components/BottomHeader"
import { getUserProfile } from "../Services/UsersApiService";

function renderScene({ route }) {
    switch (route.key) {
        case "posts":
            return (
                // <Text>First Screen</Text>
                <PostsTab />
            );
        case "likes":
            return (
                <LikesTab />
            );
        case "watchlist":
            return (
                <WatchlistTab/>
            );
    }
} 

export default function ProfilePage() {
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "posts", title: "Posts" },
        { key: "likes", title: "Likes" },
        { key: "watchlist", title: "Watchlist" },
    ]);

    const navigation = useNavigation();
    const handleEditProfile = () => {
        navigation.navigate("EditProfile");
    };

    let [userProfile, setUserProfile] = useState({});
    let [followers, setfollowers] = useState(0);
    let [following, setfollowing] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {// fetching data from api
        try {
            const userId = 'pTjrHHYS2qWczf4mKExik40KgLH3';
          const response = await  getUserProfile(userId); 
          setUserProfile(response);

          if (response.followers && response.followers.low !== undefined) {
            setfollowers(response.followers.low);
        }

        if (response.following && response.following.low !== undefined) {
            setfollowing(response.following.low);
        }
          console.log("24",following);
        } catch (error) {
          console.error('Error fetching user data:', error);
      
        } finally {
            console.log("1",userProfile);

        }
      };

      const handleRefresh = () =>{
        setRefreshing(true)
        fetchData()
        setRefreshing(false)
      }

    useEffect(() => {
        fetchData(); 
    }, []); 

    useEffect(() => {
        console.log("User Profile:", userProfile);
        console.log("Followers:", followers);
    }, [userProfile, followers, following]); 

    return (
        
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}>
                <View style={styles.accountInfo}>
                    <Image source={{ uri: "https://i.pinimg.com/originals/30/98/74/309874f1a8efd14d0500baf381502b1b.jpg" }} style={styles.avatar}></Image>
                    <Text style={styles.username}>{userProfile.fullName ? userProfile.fullName : "Itumeleng Moshokoa"}</Text>
                    <Text style={styles.userHandle}>{userProfile.username ? userProfile.username : "Joyce"}</Text>
                </View>
                <View style={styles.followInfo}>
                    <Text>
                    <Text style={styles.number}>{followers ? followers : "100"} </Text>
                        <Text style={styles.label}>Followers</Text>
                    </Text>
                    <Text>
                        <Text style={styles.number}>{following ? following : "50"} </Text>
                        <Text style={styles.label}>Following</Text>
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={handleEditProfile}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </Pressable>
                </View>
                <View style={styles.about}>
                    <Text style={{ color: "#7b7b7b", paddingBottom: 5 }}>{userProfile.pronouns ? userProfile.pronouns : "she/her"}</Text>
                    <Text>{userProfile.bio ? userProfile.bio : "I'm also just a girl, standing in front of a boy asking him to love her - Notting Hill"}</Text>
                    <Text style={{ marginTop: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Favourite genres: </Text>
                        {userProfile.favouriteGenre && userProfile.favouriteGenre.length >= 3 && (
                            <Text>{userProfile.favoriteGenres[0]}, {userProfile.favoriteGenres[1]}, {userProfile.favoriteGenres[2]}</Text>
                        )}
                    </Text>
                </View>
                <View style={styles.tabContainer}>
                    <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{ width: layout.width }} renderTabBar={(props) => <TabBar {...props} indicatorStyle={styles.indicator} labelStyle={styles.label} style={styles.tabBar} />} />
                </View>
               
            </ScrollView>
            <BottomHeader />
        </View>
    );
}

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
    },
    userHandle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#7b7b7b",
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
    },
    label: {
        fontSize: 16,
        color: "#7b7b7b",
        textTransform: "capitalize",
    },
    about: {
        marginTop: 25,
        marginHorizontal: 25,
    },
    tabContainer: {
        color: "#7b7b7b",
        marginTop: 25,
    },
    tabBar: {
        backgroundColor: "#fff",
        elevation: 0,
        shadowOpacity: 0,
    },
    indicator: {
        backgroundColor: "#7b7b7b",
        borderRadius: 50,
    },
});
// export default ProfilePage;
