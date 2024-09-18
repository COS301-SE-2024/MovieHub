import React, { useState, useEffect } from "react";
import { useTheme } from "../styles/ThemeContext";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal } from "react-native";
import { getRoomParticipants, kickUserFromRoom } from "../Services/RoomApiService";
import Icon from "react-native-vector-icons/MaterialIcons";
import RoomModal from "../Components/RoomModal";
import { useNavigation } from "@react-navigation/native";
// import BottomSheet from "@gorhom/bottom-sheet"; // Assuming you're using the Gorhom Bottom Sheet library

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
    const { theme, isDarkMode } = useTheme();
    console.log("Route",route);
    console.log("RoomId", roomId);
    console.log("Is room creator ", isRoomCreator);
    const navigation = useNavigation();
    const { roomId, isRoomCreator, roomName, admin } = route.params;
    const [participants, setParticipants] = useState(participantsData);
    const [selectedParticipant, setSelectedParticipant] = useState(null); // For the modal
    const [isKickModalVisible, setIsKickModalVisible] = useState(false);
    const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
    const bottomSheetRef = useRef(null); // Reference for the BottomSheet

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.present();
    }

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

    const handleKick = async () => {
        const response = await kickUserFromRoom(roomId, adminId, uid);
        setIsKickModalVisible(false);
    };

    const handleOpenAdminModal = (participant) => {
        setSelectedParticipant(participant);
        setIsAdminModalVisible(true);
    };

    const handleMakeAdmin = () => {
        // Implement logic for making a participant an admin
        setIsAdminModalVisible(false);
    };

    const handleProfilePress = (participant) => {
        // navigation.navigate("FollowersProfilePage", { participant });
    };

    useEffect(() => {
        const fetchRoomParticipants = async () => {
            try {
                const response = await getRoomParticipants(roomId);
                const allParticipants = [response.creator, ...response.participants];
                setParticipants(allParticipants);
            } catch (error) {
                console.error("Failed to fetch room participants:", error);
            }
        };
        fetchRoomParticipants();
    }, [route.params.roomId]);

    const renderItem = ({ item }) => (
        <View style={styles.participantItem}>
            <TouchableOpacity onPress={() => handleProfilePress(item)}>
                <Image source={{ uri: item.avatar }} style={styles.profilePicture} />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <TouchableOpacity onPress={() => handleOpenAdminModal(item)}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.usernameText}>{item.username}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
                <TouchableOpacity style={[styles.followButton, item.followed && styles.followingButton]} onPress={() => handleFollowPress(item.id)}>
                    <Text style={[styles.followButtonText, item.followed && styles.followingButtonText]}>{item.followed ? "Following" : "Follow"}</Text>
                </TouchableOpacity>
                {isRoomCreator && (
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleOpenKickModal(item)}>
                        <Text style={styles.followButtonText}>{"Kick"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="arrow-back" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.roomName}>{roomName} Participants</Text>
                </View>
                <Pressable onPress={handleOpenBottomSheet}>
                    <Icon name="more-horiz" size={24} style={{ marginRight: 10 }} />
                </Pressable>
            </View>
            <FlatList data={participants} renderItem={renderItem} keyExtractor={(item) => item.id} />

            {/* Admin Modal */}
            <Modal visible={isAdminModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Make {selectedParticipant?.name} an Admin?</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleMakeAdmin}>
                            <Text style={styles.modalButtonText}>Make Admin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: "red" }]} onPress={() => setIsAdminModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/*Kick Modal*/}
            <Modal visible={isKickModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Kick {selectedParticipant?.name} from room?</Text>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: "red" }]} onPress={handleKick}>
                            <Text style={styles.modalButtonText}>Kick</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setIsKickModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: "#4A42C0",
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
        width: 150,
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default ViewParticipants;
