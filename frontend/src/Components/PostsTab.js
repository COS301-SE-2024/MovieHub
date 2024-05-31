import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import Post from "./Post";

export default function PostsTab() {
    const username = "Rick Sanchez";
    const userHandle = "@rickestrick";
    const posts = [
        {
            postTitle: "Is Ms. Marvel worth the watch?",
            image: "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/9681C7C3404BEDE1305C98BD6A300BAB911BF870EF239C1817C11E88A6357467/scale?width=1200&amp;aspectRatio=1.78&amp;format=webp",
            preview: "When I first saw the trailer for the movie I wasn't hyped up tbh. It's been getting a bit of a popu...",
            likes: 100,
            comments: 23,
            saves: 7,
            date: "03-02-2022 11:00:00",
        },
        {
            postTitle: "Cliche doesn't always mean bad",
            preview: "Let's be honest",
            likes: 407,
            comments: 44,
            saves: 42,
        },
        {
            postTitle: "Interstellar is peak fiction",
            image: "https://sm.mashable.com/mashable_in/seo/3/38983/38983_u23h.jpg",
            preview: "If you have ever watched the movie, you know that it is an amazing piece of cinematic art. It's so...",
            likes: 703,
            comments: 207,
            saves: 60,
        },
    ]

    return (
        <View>
            {posts == null ? (
                <Text>No posts</Text>
            ) : (
                posts.map((post) => <Post username={username} userHandle={userHandle} key={post.postTitle} {...post} />)
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 25,
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.45,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
