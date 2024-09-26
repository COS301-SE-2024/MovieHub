import React, { useState, useEffect, useRef , useLayoutEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getRoomDetails, getRoomParticipantCount, joinRoom, leaveRoom, getIsParticipant } from "../Services/RoomApiService";
import { useTheme } from "../styles/ThemeContext";
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

const ViewRoom = ({ route }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { userInfo, roomId } = route.params;
    const [isRoomCreator, setIsRoomCreator] = useState(false);
    const [roomDetails, setRoomDetails] = useState(null); // State to hold room details
    const [participantCount, setParticipantCount] = useState(0); // State to hold participant count
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [watchPartyStarted, setWatchPartyStarted] = useState(false);
    const [isParticipant, setIsParticipant] = useState(false);
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
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        header: {
            marginTop: 16,
            height: 50,
            marginBottom: 30,
            backgroundColor: theme.backgroundColor,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
        },
        roomName: {
            marginLeft: 35,
            fontSize: 20,
            fontWeight: "500",
            color: theme.textColor,
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
            backgroundColor: theme.primaryColor,
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
            color: theme.textColor,
        },
        movieInfo: {
            marginBottom: 26,
        },
        movieTitle: {
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 4,
            color: theme.textColor,
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
            color: theme.gray,
        },
        profilePlaceholder: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#ccc",
            marginRight: 8,
        },
        loadingContainer: {
            backgroundColor: theme.backgroundColor,
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
            color: theme.textColor,
        },
        line: {
            height: 1,
            backgroundColor: theme.borderColor,
            marginVertical: 10,
            marginHorizontal: 16,
        },
    });

    const bottomSheetRef = useRef(null);

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.present();
    };

    const toggleTooltip = () => {
        setTooltipVisibility(!isTooltipVisible);
    };

    // Fetch room details
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await getRoomDetails(roomId);
                setRoomDetails(response.room);
                setIsRoomCreator(response.room.createdBy == userInfo.userId);

                //fetch isParticipant
                const isParticipantResponse = await getIsParticipant(userInfo.userId, roomId);
                setIsParticipant(isParticipantResponse);
                
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

    useEffect(() => {
        if (route.params?.openBottomSheet) {
          handleOpenBottomSheet();
          // Reset the param after opening the bottom sheet
          navigation.setParams({ openBottomSheet: false });
        }
      }, [route.params?.openBottomSheet]);

    useLayoutEffect(() => {
        if (loading) {
            navigation.setOptions({
            title: "Loading..."
            });
        } else if (roomDetails) {
            navigation.setOptions({
                title: roomDetails.roomName
            });
        }
    }, [navigation, loading, roomDetails]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{color: theme.textColor}}>Loading...</Text>
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
    const { roomName, maxParticipants, roomDescription, participants, shortCode = [] } = roomDetails;

    const handleJoinPress = async () => {
        try {
            const response = await joinRoom(shortCode, userInfo.userId);
            setIsParticipant(true);
            setParticipantCount(participantCount+1);
            Alert.alert('Success', 'You have joined this room!');
        } catch (error) {
            console.error("Failed to join room:", error);
        }
    };

    const handleLeavePress = async () => {
        try {
            const response = await leaveRoom(roomId, userInfo.userId);
            setIsParticipant(false);
            setParticipantCount(participantCount-1);
            Alert.alert('Success', 'You have left this room!');
        } catch (error) {
            console.error("Failed to leave room:", error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
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
                        roomDescription && <Text style={[styles.movieDescription, { paddingVertical: 20 }]}>{roomDescription}</Text>
                    )}

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        {isParticipant && (
                            <TouchableOpacity style={styles.enterButton} onPress={() => navigation.navigate("WatchParty", { userInfo, isRoomCreator, roomId: route.params.roomId })}>
                                <Text style={styles.enterText}>Enter</Text>
                            </TouchableOpacity>
                        )}
                        {!isRoomCreator  && (<>    
                            {isParticipant
                                ?(<TouchableOpacity style={[styles.enterButton, { width: 120 }]} onPress={handleLeavePress}>
                                    <Text style={styles.enterText}>Leave Room</Text>
                                </TouchableOpacity>)
                                :(<TouchableOpacity style={styles.enterButton} onPress={handleJoinPress}>
                                    <Text style={styles.enterText}>Join Room</Text>
                                </TouchableOpacity>)
                            }
                        </>)}
                        <Pressable style={styles.participants} onPress={() => navigation.navigate("ViewParticipants", { userInfo, isRoomCreator, roomId: route.params.roomId})}>
                            <FAIcon name="users" size={16} color={theme.textColor} />
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
                        {
                            upcomingParties.length === 0 && (
                                <View>
                                    <Text>No upcoming watch parties</Text>
                                    <Text></Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
            <RoomModal ref={bottomSheetRef} title="More options" roomId={route.params.roomId} route={route} isRoomCreator={isRoomCreator} userInfo={userInfo} />
        </View>
    );
};

const PartySchedule = ({ movieTitle, partyName, startTime, platform }) => {
    const [reminderSet, setReminderSet] = useState(false);
    const PlatformLogo = platformLogos[platform] || null;
    const { theme, isDarkMode } = useTheme();

    const handleReminder = () => {
        setReminderSet(!reminderSet);
        // TODO: add any logic to actually set the reminder notification
    };

    const styles = StyleSheet.create({
        upcomingParty: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDarkMode ? "#0f0f0f" : "#f0f0f0",
            padding: 16,
            marginBottom: 10,
        },
        platformLogo: {
            marginRight: 10,
        },
        partyDetails: {
            flex: 1,
            color: theme.gray
        },
        partyName: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.textColor,
        },
        startTime: {
            fontSize: 14,
            opacity: 0.5,
            color: theme.textColor,
        },
        upcomingMovieTitle: {
            fontSize: 14,
            opacity: 0.5,
            color: theme.textColor,
        },
        reminder: {
            flexDirection: "row",
            alignItems: "center",
        },
        reminderText: {
            marginLeft: 5,
            color: theme.textColor,
        },
    });

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
                    color={reminderSet ? "#4a42c0" : isDarkMode ? "white" : "black"} // Conditional color rendering
                />
                {!reminderSet && <Text style={styles.reminderText}>Remind Me</Text>}
            </TouchableOpacity>
        </View>
    );
};



export default ViewRoom;
