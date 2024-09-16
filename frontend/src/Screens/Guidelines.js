import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useTheme } from "../styles/ThemeContext";

const CommunityGuidelines = () => {
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
            color: "#7B73EC"
        },
        bold: {
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 16,
            marginBottom: 4,
        },
        paragraph: {
            fontSize: 16,
            marginBottom: 8,
            color: theme.textColor
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
            {/* <Text style={styles.heading}>Community Guidelines</Text> */}
            <Text style={styles.paragraph}>Welcome to MovieHub! To ensure a positive and respectful environment for all users, we ask that you adhere to the following community guidelines. These guidelines are designed to promote constructive and enjoyable interactions for everyone. By using MovieHub, you agree to follow these rules and help maintain a friendly and inclusive community.</Text>

            <Text style={styles.subheading}>Respectful Interaction</Text>
            <Text style={styles.bold}>1. Be Respectful:</Text>
            <Text style={styles.paragraph}>- Treat all users with respect and kindness. Avoid offensive, derogatory, or inflammatory language.</Text>
            <Text style={styles.paragraph}>- Respect differing opinions and engage in healthy, constructive discussions.</Text>
            <Text style={styles.bold}>2. No Harassment or Bullying:</Text>
            <Text style={styles.paragraph}>- Do not engage in any form of harassment, bullying, or intimidation.</Text>
            <Text style={styles.paragraph}>- Report any abusive behavior to the MovieHub support team.</Text>

            <Text style={styles.subheading}>Content Guidelines</Text>
            <Text style={styles.bold}>1. Appropriate Content:</Text>
            <Text style={styles.paragraph}>- Post content that is relevant to movies, reviews, and discussions.</Text>
            <Text style={styles.paragraph}>- Avoid posting inappropriate, explicit, or offensive content.</Text>
            <Text style={styles.bold}>2. No Spam or Self-Promotion:</Text>
            <Text style={styles.paragraph}>- Refrain from posting spam, advertisements, or excessive self-promotion.</Text>
            <Text style={styles.paragraph}>- Share links and content that are valuable and relevant to the community.</Text>
            <Text style={styles.bold}>3. Accurate Information:</Text>
            <Text style={styles.paragraph}>- Ensure that the information you share is accurate and truthful.</Text>
            <Text style={styles.paragraph}>- Avoid spreading misinformation or false claims.</Text>

            <Text style={styles.subheading}>Review and Rating Guidelines</Text>
            <Text style={styles.bold}>1. Honest Reviews:</Text>
            <Text style={styles.paragraph}>- Write honest and thoughtful reviews based on your personal experience.</Text>
            <Text style={styles.paragraph}>- Avoid posting fake or misleading reviews.</Text>
            <Text style={styles.bold}>2. Constructive Feedback:</Text>
            <Text style={styles.paragraph}>- Provide constructive feedback that can help others make informed decisions.</Text>
            <Text style={styles.paragraph}>- Refrain from using offensive or disrespectful language in your reviews.</Text>

            <Text style={styles.subheading}>Privacy and Security</Text>
            <Text style={styles.bold}>1. Protect Personal Information:</Text>
            <Text style={styles.paragraph}>- Do not share personal information such as addresses, phone numbers, or email addresses.</Text>
            <Text style={styles.paragraph}>- Respect the privacy of others and avoid asking for personal information.</Text>
            <Text style={styles.bold}>2. Report Violations:</Text>
            <Text style={styles.paragraph}>- Report any violations of these guidelines to the MovieHub support team.</Text>
            <Text style={styles.paragraph}>- Help us maintain a safe and secure community by reporting suspicious activities.</Text>

            <Text style={styles.subheading}>Community Participation</Text>
            <Text style={styles.bold}>1. Engage Positively:</Text>
            <Text style={styles.paragraph}>- Participate in discussions and activities in a positive and constructive manner.</Text>
            <Text style={styles.paragraph}>- Encourage and support other members of the community.</Text>
            <Text style={styles.bold}>2. Follow the Rules:</Text>
            <Text style={styles.paragraph}>- Adhere to these community guidelines at all times.</Text>
            <Text style={styles.paragraph}>- Follow any additional rules or policies set by MovieHub.</Text>

            <Text style={styles.subheading}>Consequences of Violations</Text>
            <Text style={styles.bold}>1. Warnings and Bans:</Text>
            <Text style={styles.paragraph}>- Violations of these guidelines may result in warnings, temporary bans, or permanent bans from the platform.</Text>
            <Text style={styles.paragraph}>- Severe or repeated violations will be taken seriously and addressed accordingly.</Text>
            <Text style={styles.bold}>2. Reporting Issues:</Text>
            <Text style={styles.paragraph}>- If you encounter any issues or violations, report them to the MovieHub support team at support@moviehub.com.</Text>
            <Text style={styles.paragraph}>- We will investigate and take appropriate action to resolve the issue.</Text>

            <Text style={styles.conclusion}>By following these community guidelines, you contribute to making MovieHub a welcoming and enjoyable place for all movie enthusiasts. Thank you for being a part of our community and helping us create a positive and respectful environment.</Text>
        </ScrollView>
    );
};



export default CommunityGuidelines;
