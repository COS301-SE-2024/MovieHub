import * as React from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Image } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { EditProfile } from "./EditProfile";
import LikesTab from "../Components/LikesTab";
import PostsTab from "../Components/PostsTab";
import WatchlistTab from"../Components/Watchlist";


function renderScene({ route }) {
    switch (route.key) {
        case "posts":
            return (
                // <Text>First Screen</Text>
                <PostsTab />
            );
        case "likes":
            return (
                <View style={styles.scene}>
                    <Text>Second Screen</Text>
                </View>
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.accountInfo}>
                    <Image source={{ uri: "https://i.pinimg.com/originals/30/98/74/309874f1a8efd14d0500baf381502b1b.jpg" }} style={styles.avatar}></Image>
                    <Text style={styles.username}>Lily Smith</Text>
                    <Text style={styles.userHandle}>@a_lily</Text>
                </View>
                <View style={styles.followInfo}>
                    <Text>
                        <Text style={styles.number}>50 </Text>
                        <Text style={styles.label}>Followers</Text>
                    </Text>
                    <Text>
                        <Text style={styles.number}>10 </Text>
                        <Text style={styles.label}>Following</Text>
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={handleEditProfile}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </Pressable>
                </View>
                <View style={styles.about}>
                    <Text style={{ color: "#7b7b7b", paddingBottom: 5 }}>She/Her</Text>
                    <Text>Genius scientist, inventor, and interdimensional traveller. I've seen every possible version of every movie, so trust me, my reviews are out of this world. I drink, I rant, and I have zero tolerance for bad sci-fi.</Text>
                    <Text style={{ marginTop: 5 }}>
                        <Text style={{ fontWeight: "bold" }}>Favourite genres: </Text>
                        <Text>Sci-Fi, Dark Comedy, Action</Text>
                    </Text>
                </View>
                <View style={styles.tabContainer}>
                    <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{ width: layout.width }} renderTabBar={(props) => <TabBar {...props} indicatorStyle={styles.indicator} labelStyle={styles.label} style={styles.tabBar} />} />
                </View>
            </ScrollView>
        </SafeAreaView>
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
