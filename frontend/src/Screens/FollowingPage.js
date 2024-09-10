import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import FollowList from '../Components/FollowList';
import { getFollowing } from '../Services/UsersApiService';

const FollowingPage = ({ route }) => {
    const { userInfo } = route.params;
    const [followers, setFollowing] = useState([]);

    const fetchFollowing = async () => {
        try {
            const response = await getFollowing(userInfo.userId);
            setFollowing(response);
        } catch (error) {
            console.error(error);
        }
    };

    // Run the effect only once on mount
    useEffect(() => {
        fetchFollowing();
    }, []); // Empty dependency array so it only runs once

    // Render individual follower items
    const renderFollower = ({ item }) => (
        <FollowList 
            username={item.username}
            userHandle={item.name}
            userAvatar={item.avatar}
        />
    );

    return (
        <View style={styles.container}>
            {followers.length > 0 ? (
                <FlatList 
                    data={followers}
                    renderItem={renderFollower}
                    keyExtractor={(item, index) => index.toString()}  // Use index or unique id
                />
            ) : (
                <Text style={styles.noFollowersText}>No followers found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: '#ffffff',
    },
    noFollowersText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});

export default FollowingPage;
