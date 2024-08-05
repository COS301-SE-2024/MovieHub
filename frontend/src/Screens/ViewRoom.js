import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import RoomModal from "../Components/RoomModal";

const ViewRoom = ({ route }) => {
    const navigation = useNavigation();
    const { userInfo } = route.params;
    const { isUserRoom } = route.params;
    const [roomName, setRoomName] = useState("Asa's Room");

    const bottomSheetRef = useRef(null);

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.present();
    };
    
    const participants = [
        { name: "Alice Johnson" },
        { name: "Bob Smith" },
        { name: "Carol Williams" },
    ]; 

    const requests = [
        { name: "Joyce Moshokoa", status: null },
        { name: "John Cena", status: "You can't see me" },
        { name: "Veno Mous", status: null },
    ];

    // TODO: fetch room details

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="arrow-back" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.roomName}>{roomName ? roomName : "Asa's Room"}</Text>
                </View>
                <Pressable  onPress={handleOpenBottomSheet}>
                    <Icon name="more-horiz" size={24} style={{ marginRight: 10 }}  />
                </Pressable>
            </View>

            <View style={styles.videoContainer}>
                <View style={styles.videoPlaceholder} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity style={styles.enterButton} onPress={() => navigation.navigate("WatchParty", { userInfo })}>
                        <Text style={styles.enterText}>Enter</Text>
                    </TouchableOpacity>
                    <View style={styles.participants}>
                        <FAIcon name="users" size={16} />
                        <Text style={styles.participantsText}>{participants.length}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>Interstellar</Text>
                <Text style={styles.movieDetails}>
                    2016 • 2h 34m • <Text style={styles.rating}>8.2</Text>
                </Text>
                <Text style={styles.movieDescription}>Okane kasegu watashi wasta. Okane kasegu watshi wastar. Star, star, star. Kira, kira, kira.</Text>
            </View>

            {isUserRoom && (
                <View style={styles.requestsContainer}>
                    <Text style={styles.requestsTitle}>
                        Requests <Text style={styles.requestsCount}>{requests.length}</Text>
                    </Text>
                    {requests.map((request, index) => (
                        <View key={index} style={styles.request}>
                            <View style={styles.profilePlaceholder} />
                            <View style={styles.requestInfo}>
                                <Text style={styles.requestName}>{request.name}</Text>
                                {request.status && <Text style={styles.requestStatus}>{request.status}</Text>}
                            </View>
                            <TouchableOpacity style={styles.acceptButton}>
                                <Text style={styles.acceptText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rejectButton}>
                                <Text style={styles.rejectText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
            
            <View style={styles.participantsContainer}>
                <Text style={styles.participantsTitle}>Participants <Text style={styles.requestsCount}>{participants.length}</Text></Text>
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
    moreOptions: {
        padding: 8,
    },
    moreText: {
        fontSize: 24,
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
    participantsIcon: {
        width: 24,
        height: 24,
        marginRight: 6,
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
    profilePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 8,
    },
    participantName: {
        fontSize: 14,
        fontWeight: "500",
    },
});

export default ViewRoom;
