import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from "react-native";
import * as Progress from 'react-native-progress';
import light_bulb from '../../../../assets/light_bulb.png';

const Quiz = ({ route, navigation }) => {
    const { className = "Quiz", questions = [] } = route.params || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [userAnswers, setUserAnswers] = useState([]); // Store user's answers
    const [score, setScore] = useState(10); // Start with 10 points
    const [showHint, setShowHint] = useState(false); // Track if the hint is shown
    const [hintUsed, setHintUsed] = useState(false); // Track if the hint was used

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

        // Deduct points if the hint was used
        if (hintUsed) {
            setScore((prevScore) => Math.max(0, prevScore - 5)); // Ensure no negative score
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setUserAnswer("");
            setShowHint(false); // Reset hint for the next question
            setHintUsed(false);  // Reset hint usage for the next question
        } else {
            // Navigate to results page with the user's answers
            navigation.navigate('Result', {
                userAnswers,
                questions,
                finalScore: score,
            });
        }
    };

    const handleShowHint = () => {
        setShowHint(true);
        setHintUsed(true);
        setScore((prevScore) => Math.max(0, prevScore - 5)); // Deduct 5 points when the hint is revealed
    };

    const progress = (currentQuestionIndex + 1) / questions.length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{className} Quiz</Text>
            <Progress.Bar progress={progress} width={null} color="#FF8C66" style={styles.progressBar} />
            <Text style={styles.question}>{currentQuestion.question}</Text>

            {/* If the current question is fill-in-the-blank */}
            {currentQuestion.type === "fill-in-blank" ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={userAnswer}
                        onChangeText={setUserAnswer}
                        placeholder="Type your answer here"
                        placeholderTextColor="#fff"
                    />
                    {/* Show hint button */}
                    {!showHint && (
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity style={styles.hintButton} onPress={handleShowHint}>
                                <Text style={[styles.hintButtonText, { fontWeight: 600 }]}>Hint</Text>
                                <Image source={light_bulb} style={styles.light_bulb} />
                                <Text style={styles.hintButtonText}>-5 points</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* Display the hint if requested */}
                    {showHint && <Text style={styles.hintText}>{currentQuestion.hint}</Text>}
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

            {/* Show next button */}
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
    hintButton: {
        marginTop: 10,
        padding: 5,
        width: 120,
        height: 120,
        backgroundColor: "#FF4747",
        borderRadius: 999,
        flexDirection: "col",
        alignItems: "center",
        justifyContent: "center",
    },
    hintButtonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    hintText: {
        marginTop: 10,
        color: "#fff",
        fontSize: 18,
        fontStyle: "italic",
    },
    light_bulb: {
        width: 40,
        height: 40,
    },  
});

export default Quiz;
