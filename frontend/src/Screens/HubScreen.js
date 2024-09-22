import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, ActivityIndicator  } from "react-native";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { getUserCreatedRooms, getUserParticipatedRooms, getPublicRooms, getRoomParticipantCount } from "../Services/RoomApiService";
import UserRoomCard from "../Components/UserRoomCard";
import BottomHeader from "../Components/BottomHeader";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";

const HubScreen = ({ route }) => {
    const { userInfo } = route.params;
    const navigation = useNavigation();
    const [createdRooms, setCreatedRooms] = useState([]);
    const [participatingRooms, setParticipatingRooms] = useState([]);
    const [publicRooms, setPublicRooms] = useState([]);
    const keywords = ["art", "city", "neon", "space", "movie", "night", "stars", "sky", "sunset", "sunrise"];
    const { theme } = useTheme();
    const [loadingCreated, setLoadingCreated] = useState(true);
    const [loadingParticipate, setLoadingParticipate] = useState(true);
    const [loadingPublic, setLoadingPublic] = useState(true);

    const fetchRooms = useCallback(async () => {
        try {
            const createdRoomsData = await getUserCreatedRooms(userInfo.userId);

            const createdRoomsWithCounts = await Promise.all(
                createdRoomsData.map(async (room) => {
                    const countResponse = await getRoomParticipantCount(room.roomId);
                    return {
                        ...room,
                        participantsCount: countResponse.participantCount || 0,
                    };
                })
            );
            setCreatedRooms(createdRoomsWithCounts);
        } catch (error) {
            console.error("Failed to fetch created rooms:", error);
        } finally {
            setLoadingCreated(false);
        }

        try {
            const participatingRoomsData = await getUserParticipatedRooms(userInfo.userId);

            const participatingRoomsWithCounts = await Promise.all(
                participatingRoomsData.map(async (room) => {
                    const countResponse = await getRoomParticipantCount(room.roomId);
                    return {
                        ...room,
                        participantsCount: countResponse.participantCount || 0,
                    };
                })
            );
            setParticipatingRooms(participatingRoomsWithCounts);
        } catch (error) {
            console.error("Failed to fetch participated rooms:", error);
        } finally {
            setLoadingParticipate(false);
        }

        try {
            const publicRoomsData = await getPublicRooms(userInfo.userId);

            const publicRoomsWithCounts = await Promise.all(
                publicRoomsData.map(async (room) => {
                    const countResponse = await getRoomParticipantCount(room.roomId);
                    return {
                        ...room,
                        participantsCount: countResponse.participantCount || 0,
                    };
                })
            );
            setPublicRooms(publicRoomsWithCounts);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setLoadingPublic(false);
        }
    }, [userInfo.userId]);

    useFocusEffect(
        useCallback(() => {
            fetchRooms();
        }, [fetchRooms])
    );

    const handleCreateRoom = ({ roomTitle, accessLevel, roomType, watchParty }) => {
        const newRoom = { roomTitle, accessLevel, roomType, watchParty, maxParticipants: 5 };
        navigation.navigate("HubScreen", { userInfo, newRoom });
    };

    const getRandomKeyword = () => {
        return keywords[Math.floor(Math.random() * keywords.length)];
    };

    const renderRoomCard = ({ item }) => (
        <UserRoomCard
            roomName={item.roomName}
            users={item.participantsCount}
            live={item.roomType !== "Chat-only"}
            keyword={getRandomKeyword()}
            handlePress={() => navigation.navigate("ViewRoom", { userInfo, isUserRoom: item.isUserRoom, roomId: item.roomId })}
            coverImage={item.coverImage}
        />
    );

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
            flex: 1,
            paddingVertical: 16,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            // paddingRight: 50 ,
            height: 50,
            paddingLeft: 20,
        },
        headerLeft: {
            flexDirection: "row",
            alignItems: "center",
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.textColor,
        },
        createRoomText: {
            fontSize: 16,
            color: "blue",
            textAlign: 'center',
            color: theme.textColor,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 15,
            paddingLeft: 20,
            color: theme.textColor,
        },
        userRoomCard: {
            width: 310, // Increase the width of the room card
            height: 210, // Increase the height of the room card
            borderRadius: 8,
            marginHorizontal: 12, // Add some margin to avoid cramped appearance
            overflow: "hidden",
        },
        imageBackground: {
            flex: 1,
            justifyContent: "flex-end",
            borderRadius: 8,
        },
        overlay: {
            flex: 1,
    
            justifyContent: "space-between",
            padding: 12,
        },
        liveText: {
            fontSize: 14, // Increase font size for better visibility
            color: "red",
            marginBottom: 6,
            
        },
        createButton: {
            flexDirection: "row",
            marginBottom: 10,
            paddingHorizontal: 10,
            alignItems: "center",
            color: theme.textColor,
        },
        createButtonText: {
            fontSize: 14,
            color: theme.textColor,
            fontWeight: "bold",
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
        cardTitle: {
            fontSize: 18, // Increase font size for better visibility
            fontWeight: "bold",
            color: theme.textColor,
        },
        cardFooter: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
        },
        userCount: {
            fontSize: 16, // Increase font size for better visibility
            color: theme.textColor,
            marginLeft: 4,
        },
        roomList: {
            paddingHorizontal: 16,
        },
        divider: {
            height: 1,
            backgroundColor: "transparent",
            marginVertical: 16,
        },
        emptyContainer: {
            alignItems: "center",
            marginVertical: 20,
        },
        emptyText: {
            fontSize: 16,
            color: theme.textColor,
        },
    });

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreateRoom", { userInfo, onRoomCreate: handleCreateRoom })}>
                        <Text style={styles.createButtonText}>Create new room</Text>
                        <View style={{ flex: 1 }} />
                        <MaterialIcons name="add" size={24} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Rooms You Created</Text>
                {loadingCreated ? (
                    <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
                ) : (
                    <>
                    {createdRooms.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>It's a bit quiet in here!</Text>
                            <Text style={styles.emptyText}>Why not start the fun by creating your first room?</Text>
                        </View>
                    )}
                    {createdRooms.length > 0 && (
                        <View>
                            <FlatList
                                data={createdRooms}
                                renderItem={renderRoomCard}
                                keyExtractor={(item) => item.roomId.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.roomList}
                            />
                            <View style={styles.divider} />
                        </View>
                    )}
                    </>
                )}

                <Text style={styles.sectionTitle}>Rooms You're Participating In</Text>
                {loadingParticipate ? (
                    <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
                ) : (
                    <>
                    {participatingRooms.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Join a room to join in on the fun!</Text>
                        </View>
                    )}
                    {participatingRooms.length > 0 && (
                        <View>
                            <FlatList
                                data={participatingRooms}
                                renderItem={renderRoomCard}
                                keyExtractor={(item) => item.roomId.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.roomList}
                            />
                            <View style={styles.divider} />
                        </View>
                    )}
                </>
                )}

                <Text style={styles.sectionTitle}>Public Rooms Available</Text>
                {loadingPublic ? (
                    <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
                ) : (
                    <>
                    {publicRooms.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No public rooms available.</Text>
                        </View>
                    )}
                    {publicRooms.length > 0 && (
                        <View>
                            <FlatList
                                data={publicRooms}
                                renderItem={renderRoomCard}
                                keyExtractor={(item) => item.roomId.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.roomList}
                            />
                            <View style={styles.divider} />
                        </View>
                    )}
                    </>
                )}
            </ScrollView>
            <BottomHeader userInfo={userInfo} />
        </View>
    );
};



export default HubScreen;



