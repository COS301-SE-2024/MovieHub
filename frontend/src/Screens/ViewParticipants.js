import React, { useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";

const participantsData = [
    { id: "1", name: "Itumeleng", username: "@ElectricTance" },
    { id: "2", name: "Nicki Minaj", username: "@nickiminaj" },
    { id: "3", name: "Ariana Grande", username: "@ariana_grande" },
    { id: "4", name: "Taylor Swift", username: "@taylorswift13" },
    { id: "5", name: "Billie Eilish", username: "@billieeilish" },
    { id: "6", name: "Khalid", username: "@khalidofficial" },
    { id: "7", name: "Drake", username: "@bbldrizzy" },
];

const ViewParticipants = () => {
    const [participants, setParticipants] = useState(participantsData);

    const handleFollowPress = (id) => {
        setParticipants((prevParticipants) =>
            prevParticipants.map((participant) =>
                participant.id === id
                    ? { ...participant, followed: !participant.followed }
                    : participant
            )
        );
    };

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
            <TouchableOpacity
                style={[
                    styles.followButton,
                    item.followed && styles.followingButton,
                ]}
                onPress={() => handleFollowPress(item.id)}
            >
                <Text
                    style={[
                        styles.followButtonText,
                        item.followed && styles.followingButtonText,
                    ]}
                >
                    {item.followed ? "Following" : "Follow"}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={participants}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 10,
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
});

export default ViewParticipants;
