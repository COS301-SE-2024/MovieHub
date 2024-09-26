import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../styles/ThemeContext";

const UsingMovieHub = () => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.backgroundColor,
            paddingTop: 0
        },
        heading: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
            color: theme.textColor,
        },
        sectionHeading: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            marginTop: 20,
            color: "#0FBFA6"
        },
        subHeading: {
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 10,
            color: theme.textColor,
        },
        text: {
            fontSize: 16,
            marginBottom: 10,
            lineHeight: 22,
            color: theme.textColor,
        },
        boldText: {
            fontWeight: "bold",
        },
        footer: {
            marginTop: 20,
            fontSize: 16,
            marginBottom: 40,
            color: theme.textColor
        },
    });

    return (
        <ScrollView style={styles.container}>            
            <Text style={styles.sectionHeading}>Navigating the Platform</Text>
            
            <Text style={styles.subHeading}>Home Screen:</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>Explore Featured Movies:</Text> The home screen displays featured movies, recommendations, and trending films. Browse through these sections to discover new content.
            </Text>
            <Text style={styles.text}>
                2. <Text style={styles.boldText}>Explore Posts and Reviews:</Text> Scroll down to view content from people you follow.
            </Text>
            <Text style={styles.text}>
                3. <Text style={styles.boldText}>Access Different Sections:</Text> Use the navigation bar at the bottom or side of the screen to access different sections such as Home, Discover, Watchlist, and Profile.
            </Text>
            
            <Text style={styles.subHeading}>Discovering Movies:</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>Search for Movies:</Text> Use the search bar at the top of the screen to find movies by title, genre, or actor. Enter your search term and browse the results.
            </Text>
            <Text style={styles.text}>
                2. <Text style={styles.boldText}>Filter Options:</Text> Apply filters to narrow down your search results. You can filter movies by genre, release year, rating, and more.
            </Text>
            
            <Text style={styles.subHeading}>Movie Details Page:</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>View Movie Information:</Text> Click on a movie to view its details, including synopsis, cast, director, release date, and user reviews.
            </Text>
            <Text style={styles.text}>
                2. <Text style={styles.boldText}>Add to Watchlist:</Text> Click the "Add to Watchlist" button to save the movie for later viewing.
            </Text>
            <Text style={styles.text}>
                3. <Text style={styles.boldText}>Rate and Review:</Text> Rate the movie and write a review to share your thoughts with the community.
            </Text>
            <Text style={styles.text}>
                4. <Text style={styles.boldText}>Start Watching:</Text> Create a room and start a watch party with your friends.
            </Text>

            <Text style={styles.sectionHeading}>Interacting with Features</Text>
            
            <Text style={styles.subHeading}>Watchlist:</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>Manage Your Watchlist:</Text> Access your Watchlist from the profile page. Here you can see all the movies you have saved for later viewing.
            </Text>
            <Text style={styles.text}>
                2. <Text style={styles.boldText}>Create a Watchlist:</Text> Click on the "Add to Watchlist" button to create a watchlist and add movies to your Watchlist.
            </Text>
            <Text style={styles.text}>
                3. <Text style={styles.boldText}>Remove Movies:</Text> To remove a movie from your Watchlist, click on the movie and select the "Remove from Watchlist" option.
            </Text>

            <Text style={styles.subHeading}>Create Content:</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>Write Reviews and Posts:</Text> Click on the "+" button at the bottom navigation of the screen to write a review or post. Toggle the switch on top to write a review
            </Text>
            <Text style={styles.text}>
                2. <Text style={styles.boldText}>View Reviews and Posts:</Text> Access your reviews from the profile page. Here you can see all the reviews you have written and add new ones.
            </Text>
            <Text style={styles.text}>
                3. <Text style={styles.boldText}>Rate Movies:</Text> Rate the movie and write a review to share your thoughts with the community.
            </Text>

            <Text style={styles.subHeading}>Explore Page</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>Join or Create Rooms:</Text> Go onto the Hubscreen and join an active room or create one for yourself.
            </Text>
            <Text style={styles.text}>
                2. <Text style={styles.boldText}>Find people to follow</Text> Scroll through posts of people across the platform and follow profiles you find interesting.
            </Text>
            
            <Text style={styles.subHeading}>Rooms:</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>Create and Join Rooms:</Text> Create a room from The Hub and start a watch party with your friends.
            </Text>
            <Text style={styles.text}>
                2. <Text style={styles.boldText}>Leave Rooms:</Text> Leave a room and stop watching it.
            </Text>

            <Text style={styles.subHeading}>User Profile:</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>View and Edit Profile:</Text> Access your profile by clicking on your profile picture on the navigation bar. Here you can view your activity, reviews, and followers.
            </Text>
            <Text style={styles.text}>
                2. <Text style={styles.boldText}>Update Profile Information:</Text> Click the "Edit Profile" button to update your personal information, profile picture, and bio.
            </Text>
            <Text style={styles.text}>
                3. <Text style={styles.boldText}>View Posts, Liked Posts and Watchlists</Text> Access your posts, liked posts, and watchlists.
            </Text>
            <Text style={styles.text}>
                4. <Text style={styles.boldText}>Delete Posts and Watchlists</Text> Delete your posts and watchlists.
            </Text>


            <Text style={styles.subHeading}>Notifications:</Text>
            <Text style={styles.text}>
                1. <Text style={styles.boldText}>Check Notifications:</Text> Access notifications from the bell icon in the navigation bar. Here you will see updates about followers, comments on your reviews, and other interactions.
            </Text>
            {/* <Text style={styles.text}>
                2. <Text style={styles.boldText}>Manage Notification Settings:</Text> Go to account settings to customize your notification preferences.
            </Text> */}

            <Text style={styles.footer}>
                By following these guidelines, you can make the most out of your MovieHub experience, discover new movies, and interact with the community. If you encounter any issues or need further assistance, please contact our support team at support@moviehub.com.
            </Text>
        </ScrollView>
    );
};



export default UsingMovieHub;
