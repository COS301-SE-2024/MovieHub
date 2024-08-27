import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { getUserCreatedRooms, getUserParticipatedRooms, getPublicRooms, getRoomParticipantCount } from "../Services/RoomApiService"; // Import the functions
import { fetchRandomImage } from "../Services/RoomApiService";

const HubScreen = ({ route }) => {
    const { userInfo } = route.params;
    const navigation = useNavigation();
    const [createdRooms, setCreatedRooms] = useState([]);
    const [participatingRooms, setParticipatingRooms] = useState([]);
    const [publicRooms, setPublicRooms] = useState([]);
    const keywords = ["art", "city", "neon", "space", "movie", "night", "stars", "sky", "sunset", "sunrise"];


    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const createdRoomsData = await getUserCreatedRooms(userInfo.userId);

                // Fetch participant counts for created rooms
                const createdRoomsWithCounts = await Promise.all(
                    createdRoomsData.map(async (room) => {
                        const countResponse = await getRoomParticipantCount(room.roomId);
                        return {
                            ...room,
                            participantsCount: countResponse.participantCount || 0, // Default to 0 if no count
                        };
                    })
                );
                setCreatedRooms(createdRoomsWithCounts);
            } catch (error) {
                console.error("Failed to fetch created rooms:", error);
            }

            try {
                const participatingRoomsData = await getUserParticipatedRooms(userInfo.userId);

                // Fetch participant counts for participating rooms
                const participatingRoomsWithCounts = await Promise.all(
                    participatingRoomsData.map(async (room) => {
                        const countResponse = await getRoomParticipantCount(room.roomId);
                        return {
                            ...room,
                            participantsCount: countResponse.participantCount || 0, // Default to 0 if no count
                        };
                    })
                );
                setParticipatingRooms(participatingRoomsWithCounts);
            } catch (error) {
                console.error("Failed to fetch participated rooms:", error);
            }

            try {
                const publicRoomsData = await getPublicRooms();

                // Fetch participant counts for public rooms
                const publicRoomsWithCounts = await Promise.all(
                    publicRoomsData.map(async (room) => {
                        const countResponse = await getRoomParticipantCount(room.roomId);
                        return {
                            ...room,
                            participantsCount: countResponse.participantCount || 0, // Default to 0 if no count
                        };
                    })
                );
                setPublicRooms(publicRoomsWithCounts);
            } catch (error) {
                console.error("Failed to fetch public rooms:", error);
            }
        };
        fetchRooms();
    }, [userInfo.userId]);

    const handleCreateRoom = ({ roomTitle, accessLevel, roomType, watchParty }) => {
        const newRoom = { roomTitle, accessLevel, roomType, watchParty, maxParticipants: 5 };
        navigation.navigate("HubScreen", { userInfo, newRoom });
    };

    const getRandomKeyword = () => {
        return keywords[Math.floor(Math.random() * keywords.length)];
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <MatIcon name="arrow-left" size={24} style={{ marginRight: 35 }} onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>The Hub</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("CreateRoom", { userInfo, onRoomCreate: handleCreateRoom })}>
                    <Text style={styles.createRoomText}>Create room</Text>
                </TouchableOpacity>
            </View>

            {createdRooms.length > 0 ? (
                <View>
                    <Text style={styles.sectionTitle}>Rooms You Created</Text>
                    {createdRooms.map((room, index) => (
                        <UserRoomCard 
                            key={index} 
                            roomName={room.roomName} 
                            users={room.participantsCount} 
                            live={room.roomType !== "Chat-only"} 
                            keyword={getRandomKeyword()}
                            handlePress={() => navigation.navigate("ViewRoom", { userInfo, isUserRoom: true, roomId: room.roomId })} 
                        />
                    ))}
                    <View style={styles.divider} />
                </View>
            ) : (
                <Text style={styles.noRoomsText}>You haven't created any rooms yet.</Text>
            )}

            {participatingRooms.length > 0 ? (
                <View>
                    <Text style={styles.sectionTitle}>Rooms You're Participating In</Text>
                    {participatingRooms.map((room, index) => (
                        <UserRoomCard 
                            key={index} 
                            roomName={room.roomName} 
                            users={room.participantsCount} 
                            live={room.roomType !== "Chat-only"}
                            keyword={getRandomKeyword()} 
                            handlePress={() => navigation.navigate("ViewRoom", { userInfo, isUserRoom: false, roomId: room.roomId })} 
                        />
                    ))}
                </View>
            ) : (
                <Text style={styles.noRoomsText}>You're not participating in any rooms yet.</Text>
            )}

            {publicRooms.length > 0 ? (
                <View>
                    <Text style={styles.sectionTitle}>Public Rooms Available</Text>
                    {publicRooms.map((room, index) => (
                        <UserRoomCard 
                            key={index} 
                            roomName={room.roomName} 
                            users={room.participantsCount} 
                            keyword={getRandomKeyword()}
                            live={room.roomType !== "Chat-only"} 
                            handlePress={() => navigation.navigate("ViewRoom", { userInfo, isUserRoom: false, roomId: room.roomId })} 
                        />
                    ))}
                </View>
            ) : (
                <Text style={styles.noRoomsText}>No public rooms available to join.</Text>
            )}
        </ScrollView>
    );
};

export const UserRoomCard = ({ roomName, users, live, handlePress, keyword }) => {
    const [randomImage, setRandomImage] = useState(null);
    const [fallbackColor, setFallbackColor] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const image = await fetchRandomImage(keyword);
                setRandomImage(image);
            } catch (error) {
                console.error("Failed to fetch random image:", error);
            }
        };
        fetchImage();

        // Generate a random color (excluding white)
        console.log("Random color:", getRandomColor());
        const randomColor = getRandomColor();
        setFallbackColor(randomColor);
    }, [keyword]);

    // Function to generate a random color, excluding white
    const getRandomColor = () => {
        const colors = [
            "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFAF33", "#57FF33", "#FF5733", 
            "#5733FF", "#33FFA1", "#A133FF", "#FF5733", "#57A1FF", "#FF3357", "#57FF33"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <TouchableOpacity style={styles.userRoomCard} onPress={handlePress}>
            {randomImage && (
                <ImageBackground 
                    source={randomImage ? { uri: randomImage } : null} 
                    style={[styles.imageBackground, { backgroundColor: fallbackColor }]} 
                    imageStyle={{ borderRadius: 8 }}
                >
                    <View style={styles.overlay}>
                        {live && <Text style={styles.liveText}>● Active</Text>}
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{roomName}</Text>
                            <View style={styles.cardFooter}>
                                <Icon name="users" size={16} color="white" />
                                <Text style={styles.userCount}>{users}</Text>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingRight: 16,
        height: 50,
        paddingLeft: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    createRoomText: {
        fontSize: 16,
        color: "blue",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        paddingLeft: 16,
    },
    noRoomsText: {
        fontSize: 16,
        color: "gray",
        paddingLeft: 16,
        paddingVertical: 8,
    },
    userRoomCard: {
        width: "85%",
        height: 210,
        borderRadius: 8,
        marginVertical: 8,
        alignSelf: 'center', // Center the card horizontally
        overflow: "hidden", // Ensure the overlay is contained within the card's rounded corners    
    },
    imageBackground: {
        flex: 1,
        justifyContent: "space-between",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // This ensures the overlay covers the entire image
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 8,
        justifyContent: "space-between",
        padding: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#d9d9d9",
        marginVertical: 16,
    },
    cardBody: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 12,
        left: 16,
        right: 16,
    },
    liveText: {
        color: "red",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    userCount: {
        marginLeft: 8,
        color: "white",
    },
});

export default HubScreen;
