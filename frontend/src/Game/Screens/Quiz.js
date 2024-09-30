import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from "react-native";
import * as Progress from 'react-native-progress';
import light_bulb from '../../../../assets/light_bulb.png'; // Adjust import as needed

const Quiz = ({ route, navigation }) => {
    const { questions } = route.params;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    const handleAnswer = () => {
        if (userAnswer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
            setScore(score + 1);
        }

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setUserAnswer(""); // Clear the answer for the next question
        } else {
            setQuizFinished(true); // Quiz finished
        }
    };

    if (quizFinished) {
        return (
            <View style={styles.container}>
                <Text style={styles.resultText}>Your Score: {score} / {questions.length}</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back to Profile</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <Progress.Bar progress={(currentQuestionIndex + 1) / questions.length} width={200} />
            </View>
            <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
            <Image source={light_bulb} style={styles.bulbImage} />
            <TextInput
                style={styles.answerInput}
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="Type your answer here"
            />
            <TouchableOpacity style={styles.button} onPress={handleAnswer}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF6B47",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    progressContainer: {
        marginBottom: 20,
    },
    questionText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    bulbImage: {
        width: 50,
        height: 50,
        marginBottom: 20,
    },
    answerInput: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#FF8C66",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        width: '100%',
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    resultText: {
        fontSize: 28,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default Quiz;
