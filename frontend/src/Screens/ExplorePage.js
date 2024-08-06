import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomHeader from "../Components/BottomHeader";
import NonFollowerPost from "../Components/NonFollowerPost";
import CategoriesFilters from "../Components/CategoriesFilters";
import ExploreHub from "../Components/ExploreHub";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

export default function ExplorePage({ route }) {
    const { userInfo } = route.params;

    const navigation = useNavigation();

    const [selectedCategory, setSelectedCategory] = React.useState("");

    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", { movieId, imageUrl, title, rating, overview, date });
    };

    const handleOpenHub = () => {
        navigation.navigate("HubScreen", { userInfo });
    };

    const rooms = [
        { movieTitle: "Another Room", roomName: "Another Room", users: 128, live: true },
        { roomName: "feel like ranting?", users: 372 },
        { movieTitle: "Marley & Me", roomName: "The Lover's Club", users: 34, live: true },
        { roomName: "JSON's Room", users: 56 },
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <CategoriesFilters categoryName="Top Reviews" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Latests Posts" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Action" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Comedy" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Drama" selectedCategory={selectedCategory} />
                </ScrollView>

                <View style={styles.header}>
                    <Text style={styles.heading}>The Hub</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" style={{ marginLeft: "auto" }} onPress={handleOpenHub} />
                </View>

                {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <ExploreHub userInfo={userInfo} />
                    <ExploreHub userInfo={userInfo} />
                    <ExploreHub userInfo={userInfo} />
                    <ExploreHub userInfo={userInfo} />
                </ScrollView> */}

                <FlatList 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    data={rooms} 
                    renderItem={({ item }) => <ExploreHub userInfo={userInfo} roomData={item} />} 
                    keyExtractor={(item, index) => index.toString()} 
                    contentContainerStyle={styles.cardRow}
                />

                <View style={styles.postsContainer}>
                    <NonFollowerPost userInfo={userInfo} />
                    <NonFollowerPost />
                    <NonFollowerPost />
                    <NonFollowerPost />
                    <NonFollowerPost />
                    <NonFollowerPost />
                </View>
            </ScrollView>
            <BottomHeader userInfo={userInfo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: "#ffffff",
        // paddingBottom:10,
    },
    heading: {
        fontFamily: "Roboto",
        color: "#000000",
        fontSize: 23,
        fontWeight: "bold",
        paddingLeft: 10,
        paddingTop: 1,
    },
    header: {
        flexDirection: "row",
        paddingTop: 15,
        padding: 10,
    },
    cardRow: {
        paddingLeft: 10,
        
    }
});
