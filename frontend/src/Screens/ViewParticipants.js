import React, { useState, useEffect } from "react";
import { useTheme } from "../styles/ThemeContext";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal, Alert } from "react-native";
import { getRoomParticipants, kickUserFromRoom, toggleAdmin } from "../Services/RoomApiService";
import Icon from "react-native-vector-icons/MaterialIcons";
import RoomModal from "../Components/RoomModal";
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet"; // Assuming you're using the Gorhom Bottom Sheet library

const participantsData = [
    // { id: "1", name: "Itumeleng", username: "@ElectricTance" },
    // { id: "2", name: "Nicki Minaj", username: "@nickiminaj" },
    // { id: "3", name: "Ariana Grande", username: "@ariana_grande" },
    // { id: "4", name: "Taylor Swift", username: "@taylorswift13" },
    // { id: "5", name: "Billie Eilish", username: "@billieeilish" },
    // { id: "6", name: "Khalid", username: "@khalidofficial" },
    // { id: "7", name: "Drake", username: "@bbldrizzy" },
];

const ViewParticipants = ({ route }) => {
    const { theme, isDarkMode } = useTheme();
    const { roomId, isRoomCreator, roomName, admin, userInfo } = route.params;
    console.log("Route",route);
    console.log("RoomId", roomId);
    console.log("Is room creator ", isRoomCreator);
    const [participants, setParticipants] = useState([]);

//     const navigation = useNavigation();
//     const [participants, setParticipants] = useState(participantsData);

    const handleFollowPress = (id) => {
        setParticipants((prevParticipants) =>
            prevParticipants.map((participant) =>
                participant.id === id ? { ...participant, followed: !participant.followed } : participant
            )
        );
    };

    const handleOpenKickModal = (participant) => {
        setSelectedParticipant(participant);
        setIsKickModalVisible(true);
    };

    const handleKick = async (selectedParticipant) => {
        const response = await kickUserFromRoom(roomId, userInfo.userId, selectedParticipant.uid);
        // setIsKickModalVisible(false);  TODO: add a confirmation before kick?
        Alert.alert('Success', 'User successfully kicked from room!');
    };

    const handleOpenAdminModal = (participant) => {
        setSelectedParticipant(participant);
        setIsAdminModalVisible(true);
    };

    const handleMakeAdmin = async () => {
        const response = await toggleAdmin(roomId, selectedParticipant.uid);
        console.log(response);
        setIsAdminModalVisible(false);
    };

    const handleProfilePress = (participant) => {
        // navigation.navigate("FollowersProfilePage", { participant });
    };

    useEffect(() => {
        const fetchRoomParticipants = async () => {
            try {
                console.log("The rooms ID in ViewRoom: ", roomId);
                const response = await getRoomParticipants(roomId);
                console.log("Room participants: ", response);
                const allParticipants = [{...response.creator, id: "creator"}, ...response.participants];
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
                {isRoomCreator && item.id != "creator" &&
                    <TouchableOpacity style={[styles.removeButton]} onPress={() => handleKick(item)}>
                    <Text style={[styles.followButtonText, item.followed && styles.followingButtonText]}>{"Remove"}</Text>
                </TouchableOpacity>}
            </View>
        </View>
        );
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
            paddingTop: 10,
        },
        participantItem: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderBottomWidth: 1,
            borderColor: theme.borderColor,
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
            color: theme.textColor,
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
            backgroundColor: theme.primaryColor,
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

    return (
        <View style={styles.container}>
            <FlatList data={participants} renderItem={renderItem} keyExtractor={(item) => item.id} />
        </View>
    );
};



export default ViewParticipants;
