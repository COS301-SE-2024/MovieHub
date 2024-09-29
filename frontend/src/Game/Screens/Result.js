import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Result = ({ route, navigation }) => {
    const { userAnswers, questions } = route.params;

    const correctAnswersCount = questions.filter((question, index) => {
        if (question.type === "fill-in-blank") {
            return userAnswers[index] === question.answer.toLowerCase();
        } else {
            return userAnswers[index] === question.options[question.correct];
        }
    }).length;

    const percentage = (correctAnswersCount / questions.length) * 100;

    // Function to determine feedback message based on percentage
    const getFeedbackMessage = (percentage) => {
        if (percentage === 100) {
            return { bold: "You're a movie genius!\n ", regular: "Congratulations for getting all the questions right!" };
        } else if (percentage >= 80) {
            return { bold: "Great job!\n", regular: "Even the best directors had to learn their craft!" };
        } else if (percentage >= 50) {
            return { bold: "Not bad!\n", regular: "You're halfway to being a cinematic wizard!" };
        } else {
            return { bold: "Keep trying!\n", regular: "Even the best directors had to learn their craft!" };
        }
    };

    const { bold, regular } = getFeedbackMessage(percentage);const feedbackMessage = getFeedbackMessage(percentage);

    return (
        <View style={styles.container}>
            <Image source={""} style={styles.confettiImage} />
            <View style={styles.resultContainer}>
                <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
                <Text style={styles.correctAnswersText}>
                    {correctAnswersCount} of {questions.length}
                </Text>
            </View>
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
                <Text style={styles.retryButtonText}>Retry Quiz</Text>
            </TouchableOpacity>
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
        borderColor: "#8a84e0",
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
