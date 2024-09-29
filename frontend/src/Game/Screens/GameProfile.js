import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import GameBottomHeader from "../Components/GameBottomHeader";
import { getUserProfile } from "../../Services/UsersApiService";
import { useUser } from "../../Services/UseridContext";
import { useTheme } from "../../styles/ThemeContext";

const GameProfile = ({ route }) => {
    const theme = useTheme();

    const { userInfo } = useUser();
    const [loading, setLoading] = useState(true); // Add this line
    const [avatar, setAvatar] = useState(null);
    const [username, setUsername] = useState("");
    const [genres, setGenres] = useState([]);

    const fetchData = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserProfile(userId);
            console.log(response.favouriteGenres);
            setAvatar(response.avatar);
            setGenres(response.favouriteGenres);
            setUsername(response.username);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false); // Set loading to false after data is fetched
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20, flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>👋 Hi {username}</Text>
                        <Text style={styles.subGreeting}>Great to see you again!</Text>
                    </View>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>2300</Text>
                        <Text style={styles.statLabel}>Exp. Points</Text>
                    </View>
                    <View style={styles.statBox}>
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
                    <Text style={styles.sectionTitle}>Quizes For You</Text>
                    {
                        genres.map((genre) => (
                            <TouchableOpacity key={genre} style={styles.classCard}>
                                <Text style={styles.className}>{genre}</Text>
                                <Text style={styles.classDetails}>12 questions left</Text>
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
        // padding: 20,
        backgroundColor: "#FF6B47",
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
