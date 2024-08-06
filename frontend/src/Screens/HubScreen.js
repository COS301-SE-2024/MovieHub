import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Modal, TextInput, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import ExploreHub from "../Components/ExploreHub";

const HubScreen = ({ route }) => {
    const { userInfo } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [roomTitle, setRoomTitle] = useState("");
    const [accessLevel, setAccessLevel] = useState("Everyone");
    const [roomType, setRoomType] = useState("Chat-only");
    const [ownsRoom, setOwnsRoom] = useState(false);
    const [userRoomDetails, setUserRoomDetails] = useState({});

    const sections = [
        {
            movieTitle: "People You Follow",
            data: [
                { roomName: "feel like ranting?", users: 372 },
                { movieTitle: "Another Room", roomName: "Another Room", users: 128 },
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

    const handleCreateRoom = ({ roomTitle, accessLevel, roomType }) => {
        // TODO: Add logic to create the room with roomTitle, accessLevel, and roomType

        const userRoomDetails = { roomTitle, accessLevel, roomType, ownsRoom };
        // setUserRoomDetails(userRoomDetails);
        setOwnsRoom(true);
        console.log("room created", userRoomDetails);
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
                // TODO: replace with userRoomDetails
                <View>
                    <UserRoomCard movieTitle="Interstellar" roomName="Asa's Room" users={0} live />
                    <View style={styles.divider} />
                </View>
            )}

            {sections.map((section, index) => (
                <View key={index} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.movieTitle}</Text>
                    <FlatList horizontal data={section.data} renderItem={({ item }) => <Card {...item} />} keyExtractor={(item, index) => index.toString()} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow} />
                </View>
            ))}

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create Room</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <MatIcon name="close" size={22} color="black" style={{ position: "absolute", right: -10, top: -5 }} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Room Name</Text>
                        <TextInput style={styles.input} placeholder="Title" value={roomTitle} onChangeText={setRoomTitle} />

                        <Text style={styles.label}>Access Level</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={accessLevel} style={styles.picker} onValueChange={(itemValue) => setAccessLevel(itemValue)}>
                                <Picker.Item label="Everyone" value="Everyone" />
                                <Picker.Item label="Invite only" value="Invite only" />
                                <Picker.Item label="Followers" value="Followers" />
                            </Picker>
                        </View>

                        <Text style={styles.label}>Room Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={roomType} style={styles.picker} onValueChange={(itemValue) => setRoomType(itemValue)}>
                                <Picker.Item label="Chat-only" value="Chat-only" />
                                <Picker.Item label="Audio and chat" value="Audio and chat" />
                            </Picker>
                        </View>
                        {/** add watch party switch */}

                        <TouchableOpacity style={styles.createButton} onPress={handleCreateRoom}>
                            <Text style={styles.createButtonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const Card = ({ movieTitle, roomName, users, live }) => (
    <TouchableOpacity style={styles.card}>
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

const UserRoomCard = ({ movieTitle, roomName, users, live }) => (
    <TouchableOpacity style={styles.userRoomCard}>
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalHeader: {
        marginBottom: 20,
        position: "relative",
        width: "100%",
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        // alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: 10,
        backgroundColor: "#D9D9D9",
        borderRadius: 5,
        marginBottom: 15,
    },
    pickerContainer: {
        width: "100%",
        borderRadius: 5,
        overflow: "hidden", // Ensures that the border radius is applied correctly
        backgroundColor: "#D9D9D9", // Matches your input and picker background
        marginBottom: 15,
    },
    picker: {
        width: "100%",
        height: 50,
    },
    createButton: {
        width: "100%",
        padding: 15,
        backgroundColor: "black",
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
    },
    createButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
});

export default HubScreen;
