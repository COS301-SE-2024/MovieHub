import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import BottomHeader from '../Components/BottomHeader';
import NonFollowerPost from '../Components/NonFollowerPost';
import CategoriesFilters from '../Components/CategoriesFilters';
import ExploreHub from '../Components/ExploreHub';
import { Ionicons } from '@expo/vector-icons';
import { getFriendsOfFriendsContent, getRandomUsersContent } from '../Services/ExploreApiService'; // Adjust import path as needed

export default function ExplorePage({ route }) {
    const { userInfo } = route.params;
    const navigation = useNavigation();

    const [friendsOfFriendsContent, setFriendsOfFriendsContent] = useState([]);
    const [randomUsersContent, setRandomUsersContent] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        // Fetch friends of friends' content
        const fetchFriendsOfFriendsContent = async () => {
            try {
                const content = await getFriendsOfFriendsContent(userInfo);
                setFriendsOfFriendsContent(content);
            } catch (error) {
                console.error('Error fetching friends of friends content:', error);
            }
        };

        // Fetch random users' content
        // const fetchRandomUsersContent = async () => {
        //     try {
        //         const content = await getRandomUsersContent(userInfo);
        //         setRandomUsersContent(content);
        //     } catch (error) {
        //         console.error('Error fetching random users content:', error);
        //     }
        // };

        fetchFriendsOfFriendsContent();
       // fetchRandomUsersContent();
    }, [userInfo]);

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
                    <Ionicons name="chevron-forward" size={24} color="black" style={{ marginLeft: "auto" }} />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <ExploreHub />
                    <ExploreHub />
                    <ExploreHub />
                    <ExploreHub />
                </ScrollView>

                <View style={styles.postsContainer}>
                    {friendsOfFriendsContent.map((item, index) => (
                        <NonFollowerPost
                            key={`fof-${index}`}
                            userInfo={userInfo} // Current user's info
                            otherUserInfo={item.fof} // Friend of friend's info
                            uid={item.fof.uid} // Friend of friend's uid
                            username={item.fof.username}
                            userHandle={item.fof.userHandle}
                            userAvatar={item.fof.userAvatar}
                            likes={item.post ? item.post.likes : 0}
                            comments={item.post ? item.post.comments : 0}
                            saves={item.post ? item.post.saves : 0}
                            image={item.post ? item.post.image : null}
                            postTitle={item.post ? item.post.postTitle : 'No Title'}
                            preview={item.post ? item.post.text : 'No Preview'}
                            datePosted={item.post ? item.post.createdAt : 'Unknown Date'}
                        />
                    ))}
                    {/* {randomUsersContent.map((item, index) => (
                        <NonFollowerPost
                            key={`random-${index}`}
                            userInfo={item.user}
                            username={item.user.username}
                            userHandle={item.user.userHandle}
                            userAvatar={item.user.userAvatar}
                            likes={item.post ? item.post.likes : 0}
                            comments={item.post ? item.post.comments : 0}
                            saves={item.post ? item.post.saves : 0}
                            image={item.post ? item.post.image : null}
                            postTitle={item.post ? item.post.title : 'No Title'}
                            preview={item.post ? item.post.preview : 'No Preview'}
                            datePosted={item.post ? item.post.datePosted : 'Unknown Date'}
                        />
                    ))} */}
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
        backgroundColor: '#ffffff',
    },
    heading: {
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 23,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 1,
    },
    header: {
        flexDirection: 'row',
        paddingTop: 15,
        padding: 10,
    },
    postsContainer: {
        paddingHorizontal: 10,
    },
});
