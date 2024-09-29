import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import * as Progress from 'react-native-progress';

const Quiz = ({ route, navigation }) => {
    const { className = "Quiz", questions = [] } = route.params || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [userAnswers, setUserAnswers] = useState([]); // Store user's answers

    if (!questions.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No questions available for this quiz.</Text>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    const handleNextQuestion = () => {
        if (currentQuestion.type === "fill-in-blank") {
            setUserAnswers((prev) => [...prev, userAnswer.trim().toLowerCase()]);
        } else if (selectedAnswer !== null) {
            setUserAnswers((prev) => [...prev, currentQuestion.options[selectedAnswer]]);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setUserAnswer("");
        } else {
            // Navigate to results page with the user's answers
            navigation.navigate('Result', {
                userAnswers,
                questions,
            });
        }
    };

    const progress = (currentQuestionIndex + 1) / questions.length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{className} Quiz</Text>
            <Progress.Bar progress={progress} width={null} color="#FF8C66" style={styles.progressBar} />
            <Text style={styles.question}>{currentQuestion.question}</Text>
            {currentQuestion.type === "fill-in-blank" ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={userAnswer}
                        onChangeText={setUserAnswer}
                        placeholder="Type your answer here"
                        placeholderTextColor="#fff"
                    />
                </>
            ) : (
                currentQuestion.options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.optionButton, selectedAnswer === index && styles.selectedOption]}
                        onPress={() => setSelectedAnswer(index)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))
            )}
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FF6B47",
    },
    title: {
        fontSize: 24,
        color: "#fff",
        marginBottom: 20,
    },
    progressBar: {
        marginBottom: 20,
        height: 10,
    },
    question: {
        fontSize: 20,
        color: "#fff",
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#fff',
        borderWidth: 1,
        color: '#fff',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    optionButton: {
        backgroundColor: "#FF8C66",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: "#FFD700",
    },
    optionText: {
        color: "#fff",
        fontSize: 16,
    },
    nextButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#8a84e0",
        borderRadius: 10,
    },
    nextButtonText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
    feedbackText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 10,
        textAlign: "center",
    },
    errorText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
    },
});

export default Quiz;
