import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useTheme } from "../styles/ThemeContext";

const GettingStarted = () => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            padding: 16,
            backgroundColor: theme.backgroundColor,
            paddingHorizontal: 20,
        },
        heading: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 16,
            color: theme.textColor
        },
        subheading: {
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 24,
            marginBottom: 8,
            color: "#F50057"
        },
        listItem: {
            fontSize: 16,
            marginTop: 8,
            color: theme.textColor
        },
        paragraph: {
            fontSize: 16,
            marginBottom: 8,
            color: theme.textColor
        },
        underline: {
            fontWeight: "bold",
        },
        conclusion: {
            fontSize: 16,
            marginTop: 24,
            marginBottom: 40,
            color: theme.textColor
        },
    });

    return (
        <ScrollView style={styles.container}>
            {/* <Text style={styles.heading}>Getting Started</Text> */}
            <Text style={styles.paragraph}>Welcome to MovieHub! This guide will help you get started with your MovieHub experience. Follow the steps below to create an account, set up your profile, and start exploring movies and connecting with other enthusiasts.</Text>

            <Text style={styles.subheading}>Creating an Account</Text>
            <Text style={styles.listItem}>
                1. <Text style={styles.underline}>Visit the Signup Page:</Text>
            </Text>
            <Text style={styles.paragraph}>- Go to the MovieHub homepage and click on "Sign Up".</Text>
            <Text style={styles.listItem}>
                2. <Text style={styles.underline}>Fill Out the Signup Form:</Text>
            </Text>
            <Text style={styles.paragraph}>- Enter your name, email address, and create a password.</Text>
            <Text style={styles.listItem}>
                3. <Text style={styles.underline}>Verify Your Email:</Text>
            </Text>
            <Text style={styles.paragraph}>- Check your email for a verification link and click on it to verify your account.</Text>
            <Text style={styles.listItem}>
                4. <Text style={styles.underline}>Complete Your Profile:</Text>
            </Text>
            <Text style={styles.paragraph}>- Add a profile picture and bio to personalize your account.</Text>

            <Text style={styles.subheading}>Setting Up Your Profile</Text>
            <Text style={styles.listItem}>
                1. <Text style={styles.underline}>Log In to Your Account:</Text>
            </Text>
            <Text style={styles.paragraph}>- Enter your email and password on the MovieHub login page.</Text>
            <Text style={styles.listItem}>
                2. <Text style={styles.underline}>Access Your Profile:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click on your profile picture or username at the top right corner of the dashboard.</Text>
            <Text style={styles.listItem}>
                3. <Text style={styles.underline}>Edit Profile:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click the "Edit Profile" button.</Text>
            <Text style={styles.paragraph}>- Update your name, bio, and other personal details.</Text>
            <Text style={styles.paragraph}>- Click "Save Changes" to apply the updates.</Text>

            <Text style={styles.subheading}>Exploring Movies</Text>
            <Text style={styles.listItem}>
                1. <Text style={styles.underline}>Browse the Movie Database:</Text>
            </Text>
            <Text style={styles.paragraph}>- Use the search bar to find movies by title, genre, or cast.</Text>
            <Text style={styles.listItem}>
                2. <Text style={styles.underline}>Read Reviews and Ratings:</Text>
            </Text>
            <Text style={styles.paragraph}>- Check out user reviews and ratings to decide what to watch next.</Text>
            <Text style={styles.listItem}>
                3. <Text style={styles.underline}>Write Your Own Reviews:</Text>
            </Text>
            <Text style={styles.paragraph}>- Share your thoughts on movies you've watched by writing reviews.</Text>

            <Text style={styles.subheading}>Connecting with Other Users</Text>
            <Text style={styles.listItem}>
                1. <Text style={styles.underline}>Follow Other Users:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click on users' profiles and follow them to see their activity and reviews.</Text>
            <Text style={styles.listItem}>
                2. <Text style={styles.underline}>Like and Comment on Reviews:</Text>
            </Text>
            <Text style={styles.paragraph}>- Engage with the community by liking and commenting on reviews.</Text>
            <Text style={styles.listItem}>
                3. <Text style={styles.underline}>Join Discussions:</Text>
            </Text>
            <Text style={styles.paragraph}>- Participate in movie discussions and share your opinions.</Text>

            <Text style={styles.conclusion}>By following these steps, you'll be well on your way to enjoying all that MovieHub has to offer. If you need further assistance, please contact our support team at support@moviehub.com.</Text>
        </ScrollView>
    );
};



export default GettingStarted;
