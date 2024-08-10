import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";

const HubScreen = ({ route }) => {
    const { userInfo, newRoom } = route.params;
    const navigation = useNavigation();
    const [ownsRoom, setOwnsRoom] = useState(false);
    const [userRoomDetails, setUserRoomDetails] = useState({});

    useEffect(() => {
        if (newRoom) {
            setUserRoomDetails(newRoom);
            setOwnsRoom(true);
        }
    }, [newRoom]);

    // TODO: replace with real data
    const sections = [
        {
            movieTitle: "People You Follow",
            data: [
                { roomName: "Feel like ranting?", users: 372 },
                { movieTitle: "My Little Pony", roomName: "Another Room", users: 128 },
            ],
        },
        {
            movieTitle: "Netflix Hub",
            data: [
                { movieTitle: "Marley & Me", roomName: "The Lover's Club", users: 34, live: true },
                { roomName: "JSON's Room", users: 56 },
            ],
        },
        {
            movieTitle: "HBO Hub",
            data: [
                { movieTitle: "Shrek 3", roomName: "Shrek Marathon!!", users: 98, live: true },
                { movieTitle: "Spiderman", roomName: "Spideyy", live: true },
            ],
        },
        {
            movieTitle: "Hulu Hub",
            data: [
                { roomName: "Another Hulu Room", users: 45 },
                { roomName: "Hulu Fun", users: 67 },
            ],
        },
    ];

    const handleCreateRoom = ({ roomTitle, accessLevel, roomType, watchParty }) => {
        const newRoom = { roomTitle, accessLevel, roomType, watchParty, maxParticipants: 5 };
        setUserRoomDetails(newRoom);
        setOwnsRoom(true);
        console.log("Room created", newRoom);

        // Navigate to the HubScreen with the new room data
        navigation.navigate("HubScreen", { userInfo, newRoom });
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

            {ownsRoom && (
                <View>
                    <UserRoomCard
                        movieTitle="Interstellar"
                        roomName={userRoomDetails.roomTitle}
                        users={0}
                        live={userRoomDetails.roomType !== "Chat-only"}
                        handlePress={() => navigation.navigate("ViewRoom", { userInfo, isUserRoom: true, roomId: userRoomDetails.roomId })}
                    />
                    <View style={styles.divider} />
                </View>
            )}

            {sections.map((section, index) => (
                <View key={index} style={styles.section}>
                    <TouchableOpacity style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{section.movieTitle}</Text>
                        <MatIcon name="chevron-right" size={24} style={{ marginBottom: 5, marginLeft: 6 }} />
                    </TouchableOpacity>
                    <FlatList
                        horizontal
                        data={section.data}
                        renderItem={({ item }) => <Card {...item} handlePress={() => navigation.navigate("ViewRoom", { userInfo, isUserRoom: false })} />}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardRow}
                    />
                </View>
            ))}

        </ScrollView>
    );
};

const Card = ({ movieTitle, roomName, users, live, handlePress }) => (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
        {live && (
            <Text style={styles.liveText}>
                ● Live - <Text>{movieTitle}</Text>
            </Text>
        )}
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{roomName}</Text>
            <View style={styles.cardFooter}>
                <Icon name="users" size={16} />
                <Text style={styles.userCount}>{users}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const UserRoomCard = ({ movieTitle, roomName, users, live, handlePress }) => (
    <TouchableOpacity style={styles.userRoomCard} onPress={handlePress} >
        {live && (
            <Text style={styles.liveText}>
                ● Live - <Text>{movieTitle}</Text>
            </Text>
        )}
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{roomName}</Text>
            <View style={styles.cardFooter}>
                <Icon name="users" size={16} />
                <Text style={styles.userCount}>{users}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

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
    section: {
        marginBottom: 25,
        paddingLeft: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    cardRow: {
        flexDirection: "row",
    },
    card: {
        position: "relative",
        width: 250,
        height: 180,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 16,
        marginRight: 16,
    },
    userRoomCard: {
        position: "relative",
        width: "85%",
        height: 210,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 16,
        margin: "auto",
    },
    divider: {
        height: 1,
        backgroundColor: "#7b7b7b7b",
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
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    userCount: {
        marginLeft: 8,
    },
});

export default HubScreen;
