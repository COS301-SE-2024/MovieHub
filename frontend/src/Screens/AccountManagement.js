import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

const AccountManagement = () => {
    return (
        <ScrollView style={styles.container}>
            {/* <Text style={styles.heading}>Account Management</Text> */}
            <Text style={styles.paragraph}>Welcome to the Account Management section of the MovieHub Help Centre. Here, you'll find detailed instructions on how to manage your MovieHub account, update your profile, change your password, and handle subscription plans. Follow the steps below to efficiently manage your MovieHub account.</Text>

            <Text style={styles.subheading}>Editing Profile Information</Text>
            <Text style={styles.bold}>Updating Personal Details:</Text>
            <Text style={styles.listItem}>
                1. <Text style={styles.underline}>Log In to Your Account:</Text>
            </Text>
            <Text style={styles.paragraph}>- Enter your email and password on the MovieHub login page.</Text>
            <Text style={styles.listItem}>
                2. <Text style={styles.underline}>Access Your Profile:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click on your profile picture at the bottom right corner of the navigation menu.</Text>
            <Text style={styles.listItem}>
                3. <Text style={styles.underline}>Edit Profile:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click the "Edit Profile" button.</Text>
            <Text style={styles.paragraph}>- Click "Apply Changes" to apply the updates.</Text>

            <Text style={styles.bold}>Changing Profile Picture:</Text>
            <Text style={styles.listItem}>
                1. <Text style={styles.underline}>Navigate to Your Profile:</Text>
            </Text>
            <Text style={styles.paragraph}>- Follow the steps to access your profile.</Text>
            <Text style={styles.listItem}>
                2. <Text style={styles.underline}>Update Profile Picture:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click on your current profile picture.</Text>
            <Text style={styles.paragraph}>- Choose a new picture from your device.</Text>
            <Text style={styles.paragraph}>- Adjust the size and position as needed.</Text>
            <Text style={styles.paragraph}>- Click "Apply Changes" to update your profile picture.</Text>

            <Text style={styles.subheading}>Password Management</Text>
            <Text style={styles.bold}>Changing Your Password:</Text>
            <Text style={styles.listItem}>
                1. <Text style={styles.underline}>Go to Account Settings:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click on your profile picture and select "Settings" from the dropdown menu.</Text>
            <Text style={styles.listItem}>
                2. <Text style={styles.underline}>Access Password Settings:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click on "Password" tab.</Text>
            <Text style={styles.listItem}>
                3. <Text style={styles.underline}>Update Your Password:</Text>
            </Text>
            <Text style={styles.paragraph}>- Enter your current password.</Text>
            <Text style={styles.paragraph}>- Enter your new password and confirm it.</Text>
            <Text style={styles.paragraph}>- Click "Save Changes" to update your password.</Text>

            <Text style={styles.bold}>Recovering a Forgotten Password:</Text>
            <Text style={styles.listItem}>
                1. <Text style={styles.underline}>Navigate to the Login Page:</Text>
            </Text>
            <Text style={styles.paragraph}>- Click on "Forgot Password?" below the login fields.</Text>
            <Text style={styles.listItem}>
                2. <Text style={styles.underline}>Reset Your Password:</Text>
            </Text>
            <Text style={styles.paragraph}>- Enter your registered email address.</Text>
            <Text style={styles.paragraph}>- Check your email for a password reset link.</Text>
            <Text style={styles.paragraph}>- Click the link and follow the instructions to reset your password.</Text>

            <Text style={styles.conclusion}>By following these guidelines, you can easily manage your MovieHub account, keep your profile up to date, and choose the subscription plan that best fits your needs. If you encounter any issues or need further assistance, please contact our support team at support@moviehub.com.</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#E8B159",
    },
    subheading: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 8,
        color: "#E8B159",
    },
    bold: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 4,
    },
    listItem: {
        fontSize: 16,
        marginTop: 8,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 8,
    },
    underline: {
        textDecorationLine: "underline",
    },
    conclusion: {
        fontSize: 16,
        marginTop: 24,
        marginBottom: 30,
    },
});

export default AccountManagement;
