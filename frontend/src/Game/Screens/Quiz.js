import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as Progress from 'react-native-progress';
import light_bulb from '../../../../assets/light_bulb.png'; // Adjust import as needed

const Quiz = ({ route, navigation }) => {
    const { questions } = route.params;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null); // To store selected option
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);

    const currentQuestion = questions[currentQuestionIndex];

    console.log("current Question", currentQuestion);

    const handleAnswer = () => {
        
        setUserAnswers([...userAnswers, selectedOption]);

        console.log("my answer",selectedOption);
        console.log("correct Answer", currentQuestion.correct+1);


        if (selectedOption === currentQuestion.correct+1) {
            setScore(score + 1);
        }

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null); // Reset the selected option for the next question
        } else {
            setQuizFinished(true); // Quiz finished
            navigation.navigate('Result', {
                userAnswers,
                questions,
                score,
            });
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
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <Image source={light_bulb} style={styles.bulbImage} />
            
            {/* Render multiple choice options */}
            {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.optionButton,
                        selectedOption === index + 1 ? styles.selectedOption : null
                    ]}
                    onPress={() => setSelectedOption(index + 1)} // Set selected option
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleAnswer} disabled={selectedOption === null}>
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
    optionButton: {
        width: '100%',
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
    },
    selectedOption: {
        backgroundColor: "#FF8C66", // Highlight selected option
    },
    optionText: {
        color: "#000",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#FF8C66",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        width: '100%',
        marginTop: 20,
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
