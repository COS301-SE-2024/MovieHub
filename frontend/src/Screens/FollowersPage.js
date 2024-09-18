import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import FollowList from '../Components/FollowList';
import { getFollowers } from '../Services/UsersApiService';

const FollowersPage = ({ route }) => {
    const { userInfo } = route.params; 
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true); 

    // Fetch followers list
    const fetchFollowers = async () => {
        try {
            const response = await getFollowers(userInfo.userId); // Fetch followers using userId
            setFollowers(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchFollowers();
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
                <ActivityIndicator size="large" color="#4a42c0" style={styles.loader} />
            ) : followers.length > 0 ? ( 
                <FlatList 
                    data={followers}
                    renderItem={renderFollower}
                    keyExtractor={(item, index) => index.toString()} // Ensure unique key for each item
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
        color: '#999',
    },
    separator: {
        borderColor: '#ddd',
        borderBottomWidth: 1,
    },
});

export default FollowersPage;
