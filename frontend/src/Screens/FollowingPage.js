import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import FollowList from '../Components/FollowList';
import { getFollowing, isFollowed } from '../Services/UsersApiService';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../styles/ThemeContext";

const FollowingPage = ({ route }) => {
    const { userInfo } = route.params;
    const [followers, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true); 
    const navigation = useNavigation();
    const { theme} = useTheme();
    const fetchFollowing = async () => {
        try {
            const response = await getFollowing(userInfo.userId); // Fetch following list using userId
    
            // Map through each following user and check if they are still being followed
            const followingWithStatus = await Promise.all(response.map(async (followingUser) => {
                const isFollowing = await isFollowed(userInfo.userId, followingUser.uid);
                return {
                    ...followingUser,  // Spread the original following user object
                    isFollowing,       // Add the isFollowing property
                };
            }));
    
            setFollowing(followingWithStatus); // Set the updated following list
        } catch (error) {
            console.error("Error fetching following:", error);
        } finally {
            setLoading(false); 
        }
    };
    

    useEffect(() => {
        fetchFollowing();
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
        },
        followSomeone: {
            textAlign: 'center',
            marginTop: 20,
            fontSize: 16,
            color: '#4a42c0',
            fontWeight: 'bold',
        },
        separator: {
            borderColor: 'transparent',
            borderBottomWidth: 1,
        },
    });

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
                <View >
                    <Text style={styles.noFollowersText}>You are not following anyone</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ExplorePage', {userInfo})}>
                        <Text style={styles.followSomeone}>Find someone to follow</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};



export default FollowingPage;