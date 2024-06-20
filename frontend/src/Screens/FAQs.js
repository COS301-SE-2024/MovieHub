import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/MaterialIcons";

const faqs = [
    {
        question: "What is MovieHub?",
        answer: "MovieHub is a comprehensive platform for movie enthusiasts to explore, review, and discuss films. It offers personalized recommendations, social networking features, and a user-friendly interface for all your movie-related needs.",
    },
    {
        question: "How do I create an account on MovieHub?",
        answer: "To create an account, click on the 'Sign Up' button on the home page, fill in your personal details, and follow the prompts to complete the registration process.",
    },
    {
        question: "How does MovieHub recommend movies?",
        answer: "MovieHub uses advanced algorithms to analyze your viewing history, ratings, and preferences to recommend movies that match your taste.",
    },
    {
        question: "Can I write my own movie reviews on MovieHub?",
        answer: "Yes, you can write and publish your own reviews for any movie listed on MovieHub. You can also rate movies and share your opinions with the community.",
    },
    {
        question: "How do I follow other users on MovieHub?",
        answer: "To follow other users, visit their profile and click on the 'Follow' button. You can follow critics, friends, and other movie enthusiasts to stay updated on their reviews and recommendations.",
    },
    {
        question: "Can I access MovieHub on my mobile device?",
        answer: "Yes, MovieHub is available as a mobile app for both iOS and Android devices. You can download it from the App Store or Google Play Store and enjoy all the features on the go.",
    },
    {
        question: "How do I delete my MovieHub account?",
        answer: "To delete your account, go to the account settings, select the 'Delete Account' option, and follow the prompts. Please note that this action is irreversible and all your data will be permanently removed from our servers.",
    },
    {
        question: "How do I edit my profile information?",
        answer: "To edit your profile information, log in to your account, go to the 'Profile' section, and click on the 'Edit Profile' button. You can update your name, profile picture, bio, and other details.",
    },
    {
        question: "Can I create a watchlist on MovieHub?",
        answer: "Yes, you can create a watchlist by adding movies you want to watch later. Simply click on the 'Add to Watchlist' button on the movie's page, and it will be saved to your personal watchlist.",
    },
    {
        question: "What types of movies are available on MovieHub?",
        answer: "MovieHub offers a wide variety of movies across all genres, including action, drama, comedy, horror, science fiction, documentaries, and more. You can use the search and filter options to find movies that interest you.",
    },
    {
        question: "How do I change my password?",
        answer: "If you need to change your password, go to the account settings and click on 'Change Password'. Follow the instructions to receive a password reset email and create a new password.",
    },
    {
        question: "How can I delete a review or comment I posted?",
        answer: "To delete a review or comment you posted, go to your profile, find the review or comment, and click on the 'Delete' button. Confirm the deletion to remove it from the platform.",
    },
];

const FAQPage = (navigation) => {
    const [activeSections, setActiveSections] = useState([]);

    const toggleSection = (index) => {
        setActiveSections((prevSections) =>
            prevSections.includes(index)
                ? prevSections.filter((sectionIndex) => sectionIndex !== index)
                : [...prevSections, index]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Frequently Asked Questions</Text>
            <Text style={styles.intro}>Here you'll find answers to some of the most commonly asked questions about our platform. We aim to provide you with all the information you need to make the most of your MovieHub experience.</Text>
            {faqs.map((faq, index) => (
                <View key={index} style={styles.faqItem}>
                    <TouchableOpacity onPress={() => toggleSection(index)} style={styles.questionContainer}>
                        <Text style={styles.question}>{faq.question}</Text>
                        <Icon
                            name={activeSections.includes(index) ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={24}
                            color="#333"
                        />
                    </TouchableOpacity>
                    <Collapsible collapsed={!activeSections.includes(index)} align="center">
                        <View style={styles.answerContainer}>
                            <Text style={styles.answer}>{faq.answer}</Text>
                        </View>
                    </Collapsible>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
        paddingHorizontal: 20, 
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#BF4D00",
    },
    intro : {
        fontSize: 16,
        paddingBottom: 20,
    },
    faqItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    questionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#f7f7f7",
        borderRadius: 5,
    },
    question: {
        fontSize: 16,
        fontWeight: "bold",
    },
    answerContainer: {
        backgroundColor: "#f7f7f7",
        padding: 15,
        paddingTop: 5
    },
    answer: {
        fontSize: 14,
        color: "#555",
    },
});

FAQPage.navigationOptions = ({ navigation }) => {
    return {
        headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('HelpCentre')}>
                <Icon name="arrow-back" size={24} color="#000" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
        ),
    };
};

export default FAQPage;
