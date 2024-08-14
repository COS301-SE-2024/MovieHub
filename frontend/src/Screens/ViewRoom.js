import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import RoomModal from "../Components/RoomModal";
import { getRoomDetails, getRoomParticipantCount } from "../Services/RoomApiService";

const ViewRoom = ({ route }) => {
    const navigation = useNavigation();
    const { userInfo } = route.params;
    const { isUserRoom } = route.params;
    const [roomDetails, setRoomDetails] = useState(null); // State to hold room details
    const [participantCount, setParticipantCount] = useState(0); // State to hold participant count
    const [loading, setLoading] = useState(true); // State to manage loading status

    const bottomSheetRef = useRef(null);

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.present();
    };

    // Fetch room details
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const roomId = route.params.roomId; // Assuming roomId is passed in route params
                const response = await getRoomDetails(roomId);
                setRoomDetails(response.room);

                // Fetch participant count
                const participantResponse = await getRoomParticipantCount(roomId);
                if (participantResponse.success) {
                    setParticipantCount(participantResponse.participantCount);
                } else {
                    console.error("Failed to fetch participant count:", participantResponse.message);
                }
            } catch (error) {
                console.error("Failed to fetch room details or participant count:", error);
            } finally {
                setLoading(false); // Stop loading spinner after data is fetched
            }
        };

        fetchRoomDetails();
    }, [route.params.roomId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!roomDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error loading room details.</Text>
            </View>
        );
    }

    // Destructure the roomDetails object for easier access
    const { roomName, maxParticipants, roomDescription, participants = [] } = roomDetails;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="arrow-back" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.roomName}>{roomName || "Asa's Room"}</Text>
                </View>
                <Pressable onPress={handleOpenBottomSheet}>
                    <Icon name="more-horiz" size={24} style={{ marginRight: 10 }} />
                </Pressable>
            </View>

            <View style={styles.videoContainer}>
                <View style={styles.videoPlaceholder} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity style={styles.enterButton} onPress={() => navigation.navigate("WatchParty", { userInfo })}>
                        <Text style={styles.enterText}>Enter</Text>
                    </TouchableOpacity>
                    <Pressable style={styles.participants} onPress={() => navigation.navigate("ViewParticipants", { userInfo })}>
                        <FAIcon name="users" size={16} />
                        <Text style={styles.participantsText}>{participantCount}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>Interstellar</Text>
                <Text style={styles.movieDetails}>
                    2016 • 2h 34m • <Text style={styles.rating}>8.2</Text>
                </Text>
                <Text style={styles.movieDescription}>{roomDescription}</Text>
            </View>

            <View style={styles.participantsContainer}>
                <Text style={styles.participantsTitle}>Participants <Text style={styles.requestsCount}>{participantCount}</Text></Text>
                {participants.map((participant, index) => (
                    <View key={index} style={styles.participant}>
                        <View style={styles.profilePlaceholder} />
                        <Text style={styles.participantName}>{participant.name}</Text>
                    </View>
                ))}
            </View>
            <RoomModal ref={bottomSheetRef} title="More options" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        marginTop: 16,
        height: 50,
        marginBottom: 30,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    roomName: {
        marginLeft: 35,
        fontSize: 20,
        fontWeight: "500",
    },
    videoContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    videoPlaceholder: {
        width: "100%",
        height: 200,
        backgroundColor: "#e0e0e0",
        marginBottom: 8,
    },
    enterButton: {
        padding: 8,
        backgroundColor: "#4a42c0",
        alignItems: "center",
        borderRadius: 4,
        marginBottom: 8,
        width: 100,
    },
    enterText: {
        fontSize: 16,
        color: "white",
    },
    participants: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 4
    },
    participantsText: {
        fontSize: 16,
        marginLeft: 5,
    },
    movieInfo: {
        marginBottom: 26,
        paddingHorizontal: 16,
    },
    movieTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
    },
    movieDetails: {
        fontSize: 16,
        marginBottom: 8,
    },
    rating: {
        color: "red",
    },
    movieDescription: {
        fontSize: 15,
        color: "#7b7b7b",
    },
    requestsContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    requestsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    requestsCount: {
        color: "#7b7b7b",
        fontSize: 15,
    },
    request: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    profilePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 8,
    },
    requestInfo: {
        flex: 1,
    },
    requestName: {
        fontSize: 14,
        fontWeight: "500",
    },
    requestStatus: {
        fontSize: 14,
        color: "#555",
    },
    acceptText: {
        padding: 8,
        color: "green",
    },
    rejectText: {
        color: "red",
        padding: 8,
    },
    participantsContainer: {
        marginBottom: 26,
        paddingHorizontal: 16,
    },
    participantsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    participant: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    participantName: {
        fontSize: 14,
        fontWeight: "500",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ViewRoom;
