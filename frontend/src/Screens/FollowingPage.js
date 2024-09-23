import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import FollowList from '../Components/FollowList';
import { getFollowing } from '../Services/UsersApiService';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../styles/ThemeContext";

const FollowingPage = ({ route }) => {
    const { userInfo } = route.params;
    console.log(userInfo);
    const [followers, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true); 
    const navigation = useNavigation();
    const { theme} = useTheme();
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