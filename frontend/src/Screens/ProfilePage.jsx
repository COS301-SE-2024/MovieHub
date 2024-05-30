import * as React from "react";
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Pressable } from "react-native";
import { Image } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { EditProfile } from "./EditProfile";

function LikesRoute () {
    <View style={[styles.scene, {  }]}>
      <Text>First Screen</Text>
    </View>
}
  
function PostsRoute () {
    <View style={[styles.scene, {  }]}>
      <Text>Second Screen</Text>
    </View>
}

function WatchlistRoute () {
    <View style={[styles.scene, {  }]}>
      <Text>Third Screen</Text>
    </View>
}
  
function renderScene({ route }) {
    switch (route.key) {
        case 'posts':
            return <View style={styles.scene}><Text>First Screen</Text></View>;
        case 'likes':
            return <View style={styles.scene}><Text>Second Screen</Text></View>;
        case 'watchlist':
            return <View style={styles.scene}><Text>Third Screen</Text></View>;
    }
}

export default function ProfilePage() {
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'posts', title: 'Posts' },
        { key: 'likes', title: 'Likes' },
        { key: 'watchlist', title: 'Watchlist' },
    ]);

    const navigation = useNavigation();
    const handleEditProfile = () => {
        navigation.navigate(EditProfile);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.accountInfo}>
                <Image source={{ uri: "https://i.pravatar.cc/300" }} style={styles.avatar}></Image>
                <Text style={styles.username}>Rick Sanchez</Text> {/* Replace with username */}
                <Text style={styles.userHandle}>@rickestrick</Text> {/* Replace with user handle */}
            </View>
            <View style={styles.followInfo}>
                <Text>
                    <Text style={styles.number}>50</Text> {/* Replace with number of followers */}
                    <Text style={styles.label}>Followers</Text>
                </Text>
                <Text>
                    <Text style={styles.number}>10</Text> {/* Replace with number of following */}
                    <Text style={styles.label}>Following</Text>
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={handleEditProfile}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </Pressable>
            </View>
            <View style={styles.about}>
                <Text style={{ color: "#7b7b7b", paddingBottom: 5 }}>He/Him</Text>
                <Text>Genius scientist, inventor, and interdimensional traveller. I've seen every possible version of every movie, so trust me, my reviews are out of this world. I drink, I rant, and I have zero tolerance for bad sci-fi.</Text>
                <Text style={{ marginTop: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Favourite genres: </Text>
                    <Text>Sci-Fi, Dark Comedy, Action</Text>
                </Text>
            </View>
            <View style={styles.tabContainer}>
                <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => <TabBar {...props} indicatorStyle={styles.indicator} labelStyle={styles.label} style={styles.tabBar} />}
                />
            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: "#fff", 
    },
    avatar: {
        width: 90,
        height: 90,
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
        fontWeight: "bold",
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
        color: '#7b7b7b',
        marginTop: 30,
    },
    tabBar: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
    },
    indicator: {
        backgroundColor: '#7b7b7b',
        borderRadius: 50
    },
});
// export default ProfilePage;
