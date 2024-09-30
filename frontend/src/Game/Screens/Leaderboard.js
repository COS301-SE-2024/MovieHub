import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import GameBottomHeader from "../Components/GameBottomHeader";
import { useTheme } from "../../styles/ThemeContext";
import { getUserProfile } from "../../Services/UsersApiService";
import { useUser } from "../../Services/UseridContext";

const Leaderboard = ({ route }) => {
    const theme = useTheme();

    const { userInfo } = useUser();
    const [loading, setLoading] = useState(true); // Add this line
    const [avatar, setAvatar] = useState(null);
    const [username, setUsername] = useState("");

    const fetchData = async () => {
        try {
            const userId = userInfo.userId;
            const response = await getUserProfile(userId);
            console.log(response);
            setAvatar(response.avatar);
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#FF6B47",
            // alignItems: "center",
            // justifyContent: "center",
        },
        leaderboard: {
            backgroundColor: "#fff",
            borderRadius: 25,
            padding: 20,
            margin: "auto",
            marginVertical: 20,
            width: 350,
            height: "85%",
            flex: 1,
            // alignItems: "center",
            justifyContent: "center",
        },
        heading: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
        },
        topThree: {
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 20,
            alignItems: "center",
        },
        rankContainer: {
            alignItems: "center",
            marginHorizontal: 5,
        },
        profileImage: {
            width: 50,
            height: 50,
            borderRadius: 25,
            marginBottom: 2,
        },
        rank: {
            fontSize: 22,
            fontWeight: "bold",
            color: "#4CAF50",
        },
        name: {
            fontSize: 16,
            fontWeight: "bold",
            color: "white",
        },
        points: {
            fontSize: 14,
            color: "#777",
        },
        currentUser: {
            backgroundColor: "#FF8C66",
            borderRadius: 15,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 15,
        },
        userDetails: {
            marginLeft: 10,
            flex: 1,
            flexDirection: "row"
        },
        details: {
            color: "#fff",
        },
        lowerRanks: {
            marginTop: 10,
        },
        rankItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
        },
        rankNumber: {
            fontSize: 16,
            fontWeight: "bold",
        },
        rankName: {
            fontSize: 16,
            flex: 1,
        },
        rankPoints: {
            fontSize: 14,
            color: "#777",
        },
        rankCrown: {
            fontSize: 16,
            marginLeft: 10,
        },
        label: {
            fontWeight: "bold",
            color: "white"
        },
        statistic: {
            padding: 5,
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.leaderboard}>
                <Text style={styles.heading}>Leaderboard</Text>

                {/* Top Three */}
                <View style={styles.topThree}>
                    <View style={styles.rankContainer}>
                        <Image style={styles.profileImage} source={{ uri: "https://example.com/devon.png" }} />
                        <Text style={styles.rank}>2</Text>
                        <Text style={styles.name}>Devon Lane</Text>
                        <Text style={styles.points}>1962 points</Text>
                    </View>

                    <View style={[styles.rankContainer]}>
                        <Image style={styles.profileImage} source={{ uri: "https://example.com/albert.png" }} />
                        <Text style={styles.rank}>1</Text>
                        <Text style={styles.name}>Albert Flores</Text>
                        <Text style={styles.points}>2000 points</Text>
                    </View>

                    <View style={styles.rankContainer}>
                        <Image style={styles.profileImage} source={{ uri: "https://example.com/bessie.png" }} />
                        <Text style={styles.rank}>3</Text>
                        <Text style={styles.name}>Bessie Cooper</Text>
                        <Text style={styles.points}>1987 points</Text>
                    </View>
                </View>

                {/* Current User */}
                <View style={styles.currentUser}>
                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                        <Image style={styles.profileImage} source={{ uri: avatar }} />
                        <Text style={styles.name}>{username}</Text>
                    </View>
                    <View style={styles.userDetails}>
                        <View style={styles.statistic}>
                            <Text style={styles.label}>Points</Text>
                            <Text style={styles.details}>204</Text>
                        </View>

                        <View style={styles.statistic}>
                            <Text style={styles.label}>Level</Text>
                            <Text style={styles.details}>Silver</Text>
                        </View>

                        <View style={styles.statistic}>
                            <Text style={styles.label}>Position</Text>
                            <Text style={styles.details}>258</Text>
                        </View>
                    </View>
                </View>

                {/* Lower Ranks */}
                <ScrollView>
                    <View style={styles.lowerRanks}>
                        {[
                            { name: "Esther Howard", points: "1087 points", crown: "👑" },
                            { name: "Leslie Alexander", points: "1055 points", crown: "👑" },
                            { name: "Kristin Watson", points: "1002 points", crown: "👑" },
                            { name: "Albert Flores", points: "917 points", crown: "👑" },
                        ].map((user, index) => (
                            <View style={styles.rankItem} key={index}>
                                <Text style={styles.rankNumber}>{index + 4} </Text>
                                <Text style={styles.rankName}>{user.name}</Text>
                                <Text style={styles.rankPoints}>{user.points}</Text>
                                <Text style={styles.rankCrown}>{user.crown}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <GameBottomHeader />
        </View>
    );
};

export default Leaderboard;
