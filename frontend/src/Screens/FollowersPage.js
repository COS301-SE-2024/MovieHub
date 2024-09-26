import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import FollowList from '../Components/FollowList';
import { getFollowers, isFollowed } from '../Services/UsersApiService';
import { useTheme } from "../styles/ThemeContext";

const FollowersPage = ({ route }) => {
    const { userInfo } = route.params;
    console.log(userInfo) 
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true); 
    const {theme} = useTheme();

    // Fetch followers list
    const fetchFollowers = async () => {
        try {
            const response = await getFollowers(userInfo.userId); // Fetch followers using userId
            
            // Map through each follower and check if they are followed
            const followersWithStatus = await Promise.all(response.map(async (follower) => {
                const isFollowing = await isFollowed(userInfo.userId, follower.uid);
                return {
                    ...follower,    // Spread the follower object
                    isFollowing,    // Add the isFollowing property
                };
            }));
            console.log("followers", followersWithStatus)
            setFollowers(followersWithStatus); // Set the updated followers list
        } catch (error) {
            console.error("Error fetching followers:", error);
        } finally {
            setLoading(false); 
        }
    };    

    useEffect(() => {
        fetchFollowers();
    }, []);

    const renderFollower = ({ item }) => (
        <FollowList 
            route={route}
            uid={item.uid}
            username={item.username}
            userHandle={item.name}
            userAvatar={item.avatar}
            isFollowing={item.isFollowing}
        />
    );

    const styles = StyleSheet.create({
        container: {
            paddingTop: 10,
            flex: 1,
            backgroundColor: theme.backgroundColor, 
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
            borderColor: 'transparent',
            borderBottomWidth: 1,
        },
    });

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



export default FollowersPage;