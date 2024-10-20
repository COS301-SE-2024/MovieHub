import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Result = ({ route, navigation }) => {
    const { userAnswers, questions,score } = route.params;

    const correctAnswersCount = questions.filter((question, index) => {
        return userAnswers[index] === question.options[question.correct];
    }).length;

    const percentage = (score / 5) * 100;

    // Function to determine feedback message based on percentage
    const getFeedbackMessage = (percentage) => {
        if (percentage === 100) {
            return { bold: "You're an absolute legend!\n", regular: "You got every question right! Are you sure you're not a movie critic on TikTok?" };
        } else if (percentage >= 80) {
            return { bold: "Slayyyy! 👏\n", regular: "You’re killing it! You definitely know your movies better than I know my Netflix password!" };
        } else if (percentage >= 50) {
            return { bold: "Not too shabby!\n", regular: "You’re halfway there! Keep at it, and soon you'll be quoting movies like a pro!" };
        } else {
            return { bold: "It's okay, we all have our moments! 😂\n", regular: "Don't worry, even the biggest stars have off days! Grab some popcorn and try again!" };
        }
    };

    const { bold, regular } = getFeedbackMessage(percentage);const feedbackMessage = getFeedbackMessage(percentage);

    return (
        <View style={styles.container}>
            <Image source={""} style={styles.confettiImage} />
            <View style={styles.resultContainer}>
                <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
                <Text style={styles.correctAnswersText}>
                    {score} of {questions.length}
                </Text>
            </View>
            {/** Give feedback messages based on results */}
            <Text style={styles.feedbackText}>
                <Text style={styles.boldText}>{bold}</Text>
                {regular}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF6B47",
        paddingBottom: 100,
    },
    confettiImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0.7,
    },
    resultContainer: {
        backgroundColor: "#fff",
        borderRadius: 999,
        height: 270,
        width: 270,
        alignItems: "center",
        borderColor: "#7855b4",
        borderWidth: 20,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    percentageText: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#FF6B47",
    },
    correctAnswersText: {
        fontSize: 18,
        color: "#888",
        marginBottom: 5,
    },
    totalQuestionsText: {
        fontSize: 18,
        color: "#888",
    },
    feedbackText: {
        color: "#fff",
        fontSize: 18,
        marginTop: 20,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    boldText: {
        fontWeight: "bold",
    },
    retryButton: {
        backgroundColor: "#8a84e0",
        borderRadius: 20,
        padding: 15,
        marginTop: 30,
        width: "80%",
    },
    retryButtonText: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center",
    },
});

export default Result;
