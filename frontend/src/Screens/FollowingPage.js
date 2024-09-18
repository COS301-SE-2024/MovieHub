import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FollowList from '../Components/FollowList';

const FollowingPage = ({ route,username, userHandle, userAvatar, likes, saves, image, postTitle, preview, datePosted }) => {
    return (
        <ScrollView style={styles.container}>
        <View>

            <FollowList/>
            <FollowList/>
            <FollowList/>
            <FollowList/>
            <FollowList/>
            <FollowList/>
            <FollowList/>
            <FollowList/>

        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: '#ffffff', // Set the background color to black
    },
    text: {
        color: '#fff', // Set the text color to white
        fontSize: 18,
    },
});

export default FollowingPage;