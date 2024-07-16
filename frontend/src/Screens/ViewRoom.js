import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewRoomHeader from "../Components/ViewRoomHeader";

const ViewRoom = ({route}) => {
    const requests = [
        { name: "Joyce Moshokoa", status: null },
        { name: "John Cena", status: "You can't see me" },
        { name: "Veno Mous", status: null },
    ];

    const roomName = "Asa's Room";
    const [isWatchParty, setIsWatchParty] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <ViewRoomHeader roomName={roomName ? roomName : "Default Room"} />

            <View style={styles.videoContainer}>
                <View style={styles.videoPlaceholder} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity style={styles.enterButton}>
                        <Text style={styles.enterText}>Enter</Text>
                    </TouchableOpacity>
                    <View style={styles.participants}>
                        <Icon name="people" size={22} />
                        <Text style={styles.participantsText}>5</Text>
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

            <View style={styles.requestsContainer}>
                <Text style={styles.requestsTitle}>
                    Requests <Text style={styles.requestsCount}>3</Text>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    roomName: {
        fontSize: 22,
        fontWeight: "bold",
    },
    moreOptions: {
        padding: 8,
    },
    moreText: {
        fontSize: 24,
    },
    videoContainer: {
        marginBottom: 16,
    },
    videoPlaceholder: {
        width: "100%",
        height: 200,
        backgroundColor: "#ccc",
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
    participantsIcon: {
        width: 24,
        height: 24,
        marginRight: 4,
    },
    participantsText: {
        fontSize: 16,
        marginLeft: 5,
    },
    movieInfo: {
        marginBottom: 26,
    },
    movieTitle: {
        fontSize: 20,
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
        fontSize: 16,
        color: "#555",
    },
    requestsContainer: {
        marginBottom: 16,
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
    // acceptButton: {
    //     padding: 8,
    //     backgroundColor: "green",
    //     borderRadius: 4,
    //     marginRight: 4,
    // },
    acceptText: {
        padding: 8,
        color: "green",
    },

    rejectText: {
        color: "red",
        padding: 8,
    },
});

export default ViewRoom;
