import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import GameBottomHeader from "../Components/GameBottomHeader";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../Services/UseridContext";
import { useTheme } from "../../styles/ThemeContext";
import { getUserProfile } from "../../Services/UsersApiService";
import { quizData } from "../Components/quizData";
import trophyIcon from "../../../../assets/trophy_icon.png"
import trophyStar from "../../../../assets/trophy_icon.png"

const GameProfile = ({ route }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { userInfo } = useUser();
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const [username, setUsername] = useState("");
    const [genres, setGenres] = useState([]);

    const fetchData = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserProfile(userId);
            if (response) {
                setAvatar(response.avatar || null); // Handle potential undefined avatar
                setGenres(response.favouriteGenres || []); // Handle potential undefined genres
                setUsername(response.username || "User"); // Default username if not provided
            } else {
                console.error("User profile is empty or undefined");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const startQuiz = (className) => {
        // Check if quiz data for the selected className exists
        if (quizData[className]) {
            navigation.navigate('Quiz', { className, questions: quizData[className] });
        } else {
            console.error(`No quiz data found for class: ${className}`);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20, flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>👋 Hi {username}</Text>
                        <Text style={styles.subGreeting}>Great to see you again!</Text>
                    </View>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.placeholderAvatar} />
                    )}
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statBox}>
                        <Image source={trophyIcon} style={styles.trophyIcon} />
                        <Text style={styles.statValue}>2300</Text>
                        <Text style={styles.statLabel}>Exp. Points</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Image source={trophyStar} style={styles.trophyIcon} />
                        <Text style={styles.statValue}>32</Text>
                        <Text style={styles.statLabel}>Ranking</Text>  
                    </View>
                </View>

                {/* Daily Quiz */}
                <TouchableOpacity style={styles.dailyQuiz}>
                    <Text style={styles.quizTitle}>Daily Quiz</Text>
                    <Text style={styles.quizSubtitle}>20 mixed questions</Text>
                    <Text style={styles.participants}>12 participated</Text>
                </TouchableOpacity>

                {/* Continue Studying */}
                <View style={styles.studyingSection}>
                    <Text style={styles.sectionTitle}>Quizzes For You</Text>
                    {
                        genres.map((genre) => (
                            <TouchableOpacity key={genre} style={styles.classCard} onPress={() => startQuiz(genre)}>
                                <Text style={styles.className}>{genre}</Text>
                                <Text style={styles.classDetails}>{quizData[genre] ? quizData[genre].length + " questions" : "No questions available"}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
            <GameBottomHeader />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF6B47",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF6B47",
    },
    loadingText: {
        color: "#fff",
        fontSize: 18,
    },
    header: {
        marginBottom: 20,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 50,
        marginBottom: 2,
    },
    placeholderAvatar: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: "#ccc", // Placeholder color if avatar is not available
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    subGreeting: {
        fontSize: 18,
        color: "#fff",
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
    },
    statBox: {
        backgroundColor: "#FF8C66",
        padding: 10,
        borderRadius: 10,
        width: "48%",
        alignItems: "center",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    statLabel: {
        fontSize: 14,
        color: "#fff",
    },
    trophyIcon: {
        width: 30,
        height: 30,
        marginBottom: 5,
        padding: 5,
    },
    dailyQuiz: {
        backgroundColor: "#FF8C66",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    quizTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    quizSubtitle: {
        fontSize: 14,
        color: "#fff",
    },
    participants: {
        fontSize: 12,
        color: "#fff",
        marginTop: 5,
    },
    studyingSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    classCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    className: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FF6B47",
    },
    classDetails: {
        fontSize: 14,
        color: "#FF6B47",
    },
});

export default GameProfile;
