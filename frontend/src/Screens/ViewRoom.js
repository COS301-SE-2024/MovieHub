import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getRoomDetails, getRoomParticipantCount } from "../Services/RoomApiService";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import RoomModal from "../Components/RoomModal";
import NetflixLogo from "../../../assets/netflix-logo.svg";
import ShowmaxLogo from "../../../assets/showmax-logo.svg";
import AppleTVLogo from "../../../assets/apple-tv.svg";

const platformLogos = {
    Netflix: NetflixLogo,
    Showmax: ShowmaxLogo,
    "Apple TV": AppleTVLogo,
};
/*
{
    "key": "ViewRoom-aoKqE-IGTnLfFrcQO5qNJ", 
    "name": "ViewRoom", 
    "params": {
        "isUserRoom": undefined, 
        "roomId": "5cfc6566-ae1a-4ab4-8444-f9d2acf5bb48", 
    "userInfo": {"userId": "gPy1yCpiX3gY1sGmwvSGSbKgeNG3", "username": "MsCharliemander"}}, "path": undefined}
*/

const ViewRoom = ({ route }) => {
    const navigation = useNavigation();
    const { userInfo } = route.params;
    const [isRoomCreator, setIsRoomCreator] = useState(false);
    const [roomDetails, setRoomDetails] = useState(null); // State to hold room details
    const [participantCount, setParticipantCount] = useState(0); // State to hold participant count
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [watchPartyStarted, setWatchPartyStarted] = useState(false);
    const [upcomingParties, setUpcomingParties] = useState([
        {
            id: 1,
            partyName: "Upcoming Party 1",
            date: "2023-05-01",
            startTime: "10:00 AM",
            platform: "Netflix",
            movieTitle: "The Matrix",
        },
        {
            id: 2,
            partyName: "Minions Unite!",
            date: "2023-05-02",
            startTime: "11:00 AM",
            platform: "Showmax",
            movieTitle: "Despicable Me 2",
        },
        {
            id: 3,
            partyName: "Upcoming Party 3",
            date: "2023-05-03",
            startTime: "12:00 PM",
            platform: "Apple TV",
            movieTitle: "The Godfather",
        },
    ]);

    const bottomSheetRef = useRef(null);

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.present();
    };

    // Fetch room details
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const roomId = route.params.roomId; // Assuming roomId is passed in route params
                console.log("The rooms ID in ViewRoom: ", roomId);
                const response = await getRoomDetails(roomId);
                setRoomDetails(response.room);
                setIsRoomCreator(response.room.createdBy == userInfo.userId);
                console.log("username: ", userInfo.username, isRoomCreator);
                console.log("Room details fetched: ", response);
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
        <View style={styles.container}>
            <ScrollView>
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
                    {watchPartyStarted ? (
                        <View>
                            <View style={styles.videoPlaceholder} />
                            <View style={styles.movieInfo}>
                                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 6 }}>Currently Playing</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={styles.movieTitle}>Megamind</Text>
                                    <Text style={styles.movieDetails}>2004 • 1h 34m</Text>
                                </View>
                                <Text style={styles.movieDescription}>A supervillain named Megamind defeats and kills his enemy. Out of boredom, he creates a superhero who becomes evil, forcing Megamind to turn into a hero.</Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={[styles.movieDescription, { paddingVertical: 20 }]}>{roomDescription}</Text>
                    )}

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <TouchableOpacity style={styles.enterButton} onPress={() => navigation.navigate("WatchParty", { userInfo, roomId: route.params.roomId })}>
                            <Text style={styles.enterText}>Enter</Text>
                        </TouchableOpacity>
                        <Pressable style={styles.participants} onPress={() => navigation.navigate("ViewParticipants", { userInfo, isRoomCreator, roomId: route.params.roomId})}>
                            <FAIcon name="users" size={16} />
                            <Text style={styles.participantsText}>{participantCount}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.line} />
                {watchPartyStarted && <Text style={[styles.movieDescription, { paddingVertical: 10, paddingHorizontal: 16 }]}>{roomDescription}</Text>}

                <View>
                    <Text style={styles.upcomingPartiesTitle}>Upcoming Watch Parties</Text>
                    <View style={{ marginBottom: 10 }}>
                        {upcomingParties.map((party, index) => (
                            <PartySchedule key={index} {...party} />
                        ))}
                    </View>
                </View>
            </ScrollView>
            <RoomModal ref={bottomSheetRef} title="More options" userInfo= {userInfo} roomId={route.params.roomId} route={route} isRoomCreator={isRoomCreator} />
        </View>
    );
};

const PartySchedule = ({ movieTitle, partyName, startTime, platform }) => {
    const [reminderSet, setReminderSet] = useState(false);
    const PlatformLogo = platformLogos[platform] || null;

    const handleReminder = () => {
        setReminderSet(!reminderSet);
        // TODO: add any logic to actually set the reminder notification
    };

    return (
        <View style={styles.upcomingParty}>
            {PlatformLogo && <PlatformLogo width={40} height={40} style={styles.platformLogo} />}
            <View style={styles.partyDetails}>
                <Text style={styles.partyName}>{partyName}</Text>
                <Text style={styles.startTime}>{startTime}</Text>
                <Text style={styles.upcomingMovieTitle}>{movieTitle}</Text>
            </View>
            <TouchableOpacity style={styles.reminder} onPress={handleReminder}>
                <Ionicons
                    name={reminderSet ? "notifications" : "notifications-outline"} // Conditional icon rendering
                    size={24}
                    color={reminderSet ? "#4a42c0" : "black"} // Conditional color rendering
                />
                {!reminderSet && <Text style={styles.reminderText}>Remind Me</Text>}
            </TouchableOpacity>
        </View>
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
    },
    participantsText: {
        marginLeft: 6,
        fontSize: 16,
    },
    movieInfo: {
        marginBottom: 26,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    movieDetails: {
        fontSize: 15,
        marginBottom: 8,
        color: "gray",
    },
    rating: {
        color: "red",
    },
    movieDescription: {
        fontSize: 15,
        color: "#7b7b7b",
    },
    profilePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 8,
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
    upcomingPartiesTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    line: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 10,
        marginHorizontal: 16,
    },
    upcomingParty: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 16,
        marginBottom: 10,
    },
    platformLogo: {
        marginRight: 10,
    },
    partyDetails: {
        flex: 1,
    },
    partyName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    startTime: {
        fontSize: 14,
        color: "gray",
    },
    upcomingMovieTitle: {
        fontSize: 16,
        color: "#333",
    },
    reminder: {
        flexDirection: "row",
        alignItems: "center",
    },
    reminderText: {
        marginLeft: 5,
        fontSize: 14,
    },
});

export default ViewRoom;
