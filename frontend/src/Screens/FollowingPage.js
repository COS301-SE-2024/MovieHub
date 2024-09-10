import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import FollowList from '../Components/FollowList';
import { getFollowing } from '../Services/UsersApiService';

const FollowingPage = ({ route }) => {
    const { userInfo } = route.params;
    const [followers, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true); 

    const fetchFollowing = async () => {
        try {
            const response = await getFollowing(userInfo.userId);
            setFollowing(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchFollowing();
    }, []); 


    const renderFollower = ({ item }) => (
        <FollowList 
            username={item.username}
            userHandle={item.name}
            userAvatar={item.avatar}
        />
    );

    return (
        <View style={styles.container}>
            {loading ? (
                // Show loading indicator while fetching followers
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : followers.length > 0 ? (
                <FlatList 
                    data={followers}
                    renderItem={renderFollower}
                    keyExtractor={(item, index) => index.toString()} 
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    loader: {
        marginTop: 20, 
    },
    noFollowersText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#4a42c0',
    },
    separator: {
        borderColor: '#ddd',
        borderBottomWidth: 1,
    },
});

export default FollowingPage;
