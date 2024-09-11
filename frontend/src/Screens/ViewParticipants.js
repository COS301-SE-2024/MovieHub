import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { getRoomParticipants, kickUserFromRoom } from "../Services/RoomApiService";
import Icon from "react-native-vector-icons/MaterialIcons";
import RoomModal from "../Components/RoomModal";
import { useNavigation } from "@react-navigation/native";

const participantsData = [
    { id: "1", name: "Itumeleng", username: "@ElectricTance" },
    { id: "2", name: "Nicki Minaj", username: "@nickiminaj" },
    { id: "3", name: "Ariana Grande", username: "@ariana_grande" },
    { id: "4", name: "Taylor Swift", username: "@taylorswift13" },
    { id: "5", name: "Billie Eilish", username: "@billieeilish" },
    { id: "6", name: "Khalid", username: "@khalidofficial" },
    { id: "7", name: "Drake", username: "@bbldrizzy" },
];

const ViewParticipants = ({ route }) => {
    const navigation = useNavigation();
    const { roomId, isRoomCreator, roomName } = route.params;
    const [participants, setParticipants] = useState(participantsData);

    const handleFollowPress = (id) => {
        setParticipants((prevParticipants) => prevParticipants.map((participant) => (participant.id === id ? { ...participant, followed: !participant.followed } : participant)));
    };

    const handleKickPress = async (userId) => {

    };
    
    const bottomSheetRef = useRef(null);

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.present();
    };

    useEffect(() => {
        const fetchRoomParticipants = async () => {
            try {
                console.log("The rooms ID in ViewRoom: ", roomId);
                const response = await getRoomParticipants(roomId);
                console.log("Room participants: ", response);
                const allParticipants = [response.creator, ...response.participants];
                setParticipants(allParticipants);
            } catch (error) {
                console.error("Failed to fetch room participants:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoomParticipants();
    }, [route.params.roomId]);

    const renderItem = ({ item }) => (
        <View style={styles.participantItem}>
            <Image
                source={{ uri: "https://via.placeholder.com/150" }} // Placeholder for profile picture
                style={styles.profilePicture}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.usernameText}>{item.username}</Text>
            </View>
            <View style={{display: "flex", flexDirection: "row"}}>
                <TouchableOpacity style={[styles.followButton, item.followed && styles.followingButton]} onPress={() => handleFollowPress(item.id)}>
                    <Text style={[styles.followButtonText, item.followed && styles.followingButtonText]}>{item.followed ? "Following" : "Follow"}</Text>
                </TouchableOpacity>
                {isRoomCreator &&
                    <TouchableOpacity style={[styles.removeButton]} onPress={() => handleFollowPress(item.id)}>
                    <Text style={[styles.followButtonText, item.followed && styles.followingButtonText]}>{"Kick"}</Text>
                </TouchableOpacity>}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name="arrow-back" size={24} onPress={() => navigation.goBack()} />
                        <Text style={styles.roomName}>{roomName || "Asa's Room"} Participants</Text>
                    </View>
                    <Pressable onPress={handleOpenBottomSheet}>
                        <Icon name="more-horiz" size={24} style={{ marginRight: 10 }} />
                    </Pressable>
                </View>
                <FlatList data={participants} renderItem={renderItem} keyExtractor={(item) => item.id} />
            </ScrollView>
            <RoomModal ref={bottomSheetRef} title="More options" roomId={route.params.roomId} route={route} isRoomCreator={isRoomCreator} />
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
    participantItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    profilePicture: {
        marginLeft: 10,
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: "#000",
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    nameText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    usernameText: {
        fontSize: 14,
        color: "#888",
    },
    followButton: {
        marginRight: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: "#4A42C0",
    },
    followButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    followingButton: {
        backgroundColor: "#E1E8ED",
    },
    followingButtonText: {
        color: "#657786",
    },
    removeButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: "#d10000",
    },
});

export default ViewParticipants;
