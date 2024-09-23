import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../styles/ThemeContext";
const TermsOfUse = () => {
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
                <Text style={styles.paragraph}>
                    Welcome to MovieHub! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions (the "Terms of Use"). Please read these terms carefully before using our services.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Acceptance of Terms</Text>
                <Text style={styles.paragraph}>
                    By using MovieHub, you agree to these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our platform.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Changes to Terms</Text>
                <Text style={styles.paragraph}>
                    We reserve the right to modify these Terms of Use at any time. We will notify you of any changes by posting the new Terms of Use on this page and updating the "Last Updated" date. Your continued use of MovieHub after any changes indicates your acceptance of the new terms.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>User Accounts</Text>
                <Text style={styles.subHeading}>Registration:</Text>
                <Text style={styles.paragraph}>
                    You must create an account to access certain features of MovieHub. Provide accurate and complete information during the registration process.
                </Text>
                <Text style={styles.subHeading}>Account Security:</Text>
                <Text style={styles.paragraph}>
                    You are responsible for maintaining the confidentiality of your account information and password. Notify us immediately of any unauthorized use of your account.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>User Conduct</Text>
                <Text style={styles.paragraph}>
                    You agree not to use MovieHub for any unlawful purpose or in a way that violates these Terms of Use. This includes, but is not limited to, posting harmful or offensive content, infringing on others' rights, and disrupting the platform's functionality.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Content Ownership</Text>
                <Text style={styles.paragraph}>
                    All content on MovieHub, including text, graphics, logos, and images, is the property of MovieHub or its content suppliers and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our permission.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>User-Generated Content</Text>
                <Text style={styles.paragraph}>
                    By posting content on MovieHub, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, and distribute your content. You are responsible for the content you post and must ensure it does not violate any laws or infringe on others' rights.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Termination</Text>
                <Text style={styles.paragraph}>
                    We may terminate or suspend your account and access to MovieHub at our discretion, without prior notice, for conduct that we believe violates these Terms of Use or is harmful to other users.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Disclaimers and Limitation of Liability</Text>
                <Text style={styles.paragraph}>
                    MovieHub is provided "as is" without warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or reliability of any content on our platform. To the fullest extent permitted by law, we disclaim all liability for any damages arising out of your use of MovieHub.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Governing Law</Text>
                <Text style={styles.paragraph}>
                    These Terms of Use are governed by and construed in accordance with the laws of the jurisdiction in which MovieHub operates. Any disputes arising from these terms will be resolved in the courts of that jurisdiction.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions about these Terms of Use, please contact us:
                </Text>
                <Text style={styles.paragraph}>Email: support@moviehub.com</Text>
                <Text style={styles.paragraph}>Last Updated: June 3, 2024</Text>
                <Text style={{ marginBottom: 40, fontSize: 16, color: theme.textColor }}>Thank you for using MovieHub! We hope you enjoy our platform.</Text>
            </View>
        </ScrollView>
    );
};



export default TermsOfUse;
