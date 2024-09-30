import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../styles/ThemeContext";

const PrivacyPolicy = () => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.backgroundColor,
        },
        section: {
            marginBottom: 20,
            fontSize: 16,
            color: theme.textColor,
        },
        heading: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            color: theme.textColor,
        },
        subHeading: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 5,
            color: theme.textColor,
        },
        paragraph: {
            marginBottom: 10,
            fontSize: 16,
            color: theme.textColor,
        },
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.heading}>Introduction</Text>
                <Text style={styles.paragraph}>Welcome to MovieHub! We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our platform.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Information We Collect</Text>
                <Text style={styles.subHeading}>Personal Information:</Text>
                <Text style={styles.paragraph}>- Username</Text>
                <Text style={styles.paragraph}>- Profile picture (optional)</Text>
                <Text style={styles.subHeading}>Usage Data:</Text>
                <Text style={styles.paragraph}>- Browsing history</Text>
                <Text style={styles.paragraph}>- Search queries</Text>
                <Text style={styles.paragraph}>- Movie preferences and watch history</Text>
                <Text style={styles.paragraph}>- Reviews, ratings, and comments</Text>
                <Text style={styles.subHeading}>Technical Data:</Text>
                <Text style={styles.paragraph}>- IP address</Text>
                <Text style={styles.paragraph}>- Device type</Text>
                <Text style={styles.paragraph}>- Operating system</Text>
                <Text style={styles.paragraph}>- Browser type</Text>
                <Text style={styles.paragraph}>- Log files</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>How We Use Your Information</Text>
                <Text style={styles.subHeading}>Personal Information:</Text>
                <Text style={styles.paragraph}>- To create and manage your account</Text>
                <Text style={styles.paragraph}>- To communicate with you, including sending notifications and newsletters</Text>
                <Text style={styles.paragraph}>- To process payments and subscriptions</Text>
                <Text style={styles.subHeading}>Usage Data:</Text>
                <Text style={styles.paragraph}>- To personalize your movie recommendations</Text>
                <Text style={styles.paragraph}>- To improve our services and user experience</Text>
                <Text style={styles.paragraph}>- To conduct research and analytics</Text>
                <Text style={styles.subHeading}>Technical Data:</Text>
                <Text style={styles.paragraph}>- To monitor and improve the functionality and security of our platform</Text>
                <Text style={styles.paragraph}>- To prevent fraud and abuse</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Sharing Your Information</Text>
                <Text style={styles.paragraph}>We do not sell your personal information. We may share your information with third parties in the following situations:</Text>
                <Text style={styles.paragraph}>- Service Providers: We may share information with third-party vendors who help us operate and improve our services.</Text>
                <Text style={styles.paragraph}>- Legal Requirements: We may disclose information if required to do so by law or in response to valid requests by public authorities.</Text>
                <Text style={styles.paragraph}>- Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Data Security</Text>
                <Text style={styles.paragraph}>We implement robust security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is completely secure, so we cannot guarantee absolute security.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Your Rights</Text>
                <Text style={styles.paragraph}>You have the right to:</Text>
                <Text style={styles.paragraph}>- Access your personal information and request a copy of it.</Text>
                <Text style={styles.paragraph}>- Correct any inaccuracies in your personal information.</Text>
                <Text style={styles.paragraph}>- Delete your personal information, subject to certain exceptions.</Text>
                <Text style={styles.paragraph}>- Object to the processing of your personal information.</Text>
                <Text style={styles.paragraph}>- Withdraw your consent at any time (if processing is based on consent).</Text>
                <Text style={styles.paragraph}>To exercise these rights, please contact us at girlsgonecode.capstone@gmail.com.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Cookies and Tracking Technologies</Text>
                <Text style={styles.paragraph}>We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Changes to This Privacy Policy</Text>
                <Text style={styles.paragraph}>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Contact Us</Text>
                <Text style={styles.paragraph}>If you have any questions about this Privacy Policy, please contact us:</Text>
                <Text style={styles.paragraph}>Email: girlsgonecode.capstone@gmail.com</Text>
                <Text style={styles.paragraph}>Last Updated: June 3, 2024</Text>
                <Text style={{ marginBottom: 40, fontSize: 16, color: theme.textColor }}>Thank you for using MovieHub! We value your privacy and are committed to protecting your personal information.</Text>
            </View>
        </ScrollView>
    );
};


export default PrivacyPolicy;
