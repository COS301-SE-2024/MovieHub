import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const SocialFeatures = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionHeading}>Following Other Users</Text>
            <Text style={styles.subHeading}>1. Finding Users to Follow:</Text>
            <Text style={styles.text}>
                - <Text>Explore the Community:</Text> Use the search bar to find users by their username or explore the "Discover" section to find popular users.
            </Text>
            <Text style={styles.text}>
                - <Text>Follow a User:</Text> Visit the profile of the user you want to follow. Click the "Follow" button to start following them. You will now see their reviews and activities in your feed.
            </Text>
            <Text style={styles.subHeading}>2. Managing Your Followers:</Text>
            <Text style={styles.text}>
                - <Text>View Your Followers:</Text> Go to your profile and click on the "Followers" tab to see who is following you.
            </Text>
            <Text style={styles.text}>
                - <Text>Unfollow a User:</Text> Visit the profile of the user you want to unfollow. Click the "Unfollow" button to stop following them.
            </Text>

            <Text style={styles.sectionHeading}>Commenting on Reviews</Text>
            <Text style={styles.subHeading}>1. Adding a Comment:</Text>
            <Text style={styles.text}>
                - <Text>Find a Review:</Text> Browse through movie pages or your feed to find a review you want to comment on.
            </Text>
            <Text style={styles.text}>
                - <Text>Post a Comment:</Text> Click on the "Comment" button below the review. Type your comment in the text box and click "Post" to publish your comment.
            </Text>
            <Text style={styles.subHeading}>2. Editing or Deleting a Comment:</Text>
            <Text style={styles.text}>
                - <Text>Edit a Comment:</Text> Find the comment you want to edit and click the "Edit" button. Make your changes and click "Save" to update your comment.
            </Text>
            <Text style={styles.text}>
                - <Text>Delete a Comment:</Text> Find the comment you want to delete and click the "Delete" button. Confirm the deletion to remove your comment.
            </Text>

            <Text style={styles.sectionHeading}>Sharing Content</Text>
            <Text style={styles.subHeading}>1. Sharing a Movie or Review:</Text>
            <Text style={styles.text}>
                - <Text>Share with Friends:</Text> Find the movie or review you want to share. Click the "Share" button and choose your preferred method (e.g., social media, email, direct link).
            </Text>
            <Text style={styles.subHeading}>2.Using Social Media Integration:</Text>
            <Text style={styles.text}>
                - <Text >Connect Your Accounts:</Text> Go to your account settings and connect your social media accounts (e.g., Facebook, Twitter). You can now share content directly from MovieHub to your social media profiles.
            </Text>
            <Text style={styles.footer}>By following these guidelines, you can actively participate in the MovieHub community, engage with other users, and share your favorite movies and reviews with your friends. If you encounter any issues or need further assistance, please contact our support team at support@moviehub.com.</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 20,
        color: "#3A97CB"
    },
    subHeading: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 22,
    },
    boldText: {
        fontWeight: "bold",
    },
    footer: {
        marginTop: 20,
        fontSize: 16,
        marginBottom: 40

    },
});

export default SocialFeatures;
