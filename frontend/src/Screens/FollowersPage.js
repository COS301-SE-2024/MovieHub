import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import FollowList from '../Components/FollowList';
import { getFollowers } from '../Services/UsersApiService';

const FollowersPage = ({ route }) => {
    const { userInfo } = route.params; // Assuming userInfo is passed via route params
    const [followers, setFollowers] = useState([]);

    // Fetch followers list
    const fetchFollowers = async () => {
        try {
            const response = await getFollowers(userInfo.userId); // Fetch followers using userId
            setFollowers(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFollowers();
    }, []); // Run only once on mount

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
                    keyExtractor={(item, index) => index.toString()} // Ensure unique key for each item
                    ItemSeparatorComponent={() => <View style={{ borderColor: '#ddd', borderBottomWidth: 1 }} />}
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
        backgroundColor: '#ffffff', // Set the background color to white
    },
    noFollowersText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});

export default FollowersPage;
