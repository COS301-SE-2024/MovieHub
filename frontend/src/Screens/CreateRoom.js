import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Switch, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";

const CreateRoomScreen = ({ route }) => {
    const navigation = useNavigation();
    const { onRoomCreate } = route.params;
    const { userInfo } = route.params;
    const [roomTitle, setRoomTitle] = useState("");
    const [accessLevel, setAccessLevel] = useState("Everyone");
    const [roomType, setRoomType] = useState("Chat-only");
    const [watchParty, setWatchParty] = useState(false);

    const handleCreateRoom = () => {
        onRoomCreate({ roomTitle, accessLevel, roomType, watchParty });
        navigation.navigate("HubScreen", { userInfo: route.params.userInfo });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={{ marginRight: 35 }} onPress={() => navigation.goBack()}>
                    <MatIcon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Create Room</Text>
            </View>

            <Text style={styles.label}>Room Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={roomTitle}
                onChangeText={setRoomTitle}
            />

            <Text style={styles.label}>Access Level</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={accessLevel}
                    style={styles.picker}
                    onValueChange={(itemValue) => setAccessLevel(itemValue)}
                >
                    <Picker.Item label="Everyone" value="Everyone" />
                    <Picker.Item label="Invite only" value="Invite only" />
                    <Picker.Item label="Followers" value="Followers" />
                </Picker>
            </View>

            <Text style={styles.label}>Room Type</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={roomType}
                    style={styles.picker}
                    onValueChange={(itemValue) => setRoomType(itemValue)}
                >
                    <Picker.Item label="Chat-only" value="Chat-only" />
                    <Picker.Item label="Audio and chat" value="Audio and chat" />
                </Picker>
            </View>

            <View style={styles.switchContainer}>
                <Text style={styles.label}>Watch Party</Text>
                <Switch
                    value={watchParty}
                    onValueChange={setWatchParty}
                    trackColor={{ false: "#767577", true: "#2C2A6F" }}
                    thumbColor={watchParty ? "#4A42C0" : "#f4f3f4"}
                />
            </View>

            <TouchableOpacity style={[styles.createButton, roomTitle === "" ? styles.disabledButton : null]} onPress={handleCreateRoom} disabled={roomTitle === ""}>
                <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        height: 40,
    },
    title: {
        fontSize: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
        marginTop: 20,
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
        backgroundColor: "#D9D9D9",
        marginBottom: 15,
    },
    picker: {
        width: "100%",
        height: Platform.OS === 'ios' ? 150 : 50, // Adjust height for iOS
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    createButton: {
        width: "100%",
        padding: 15,
        backgroundColor: "black",
        borderRadius: 5,
        alignItems: "center",
    },
    createButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    disabledButton: {
        opacity: 0.75,
    },
});

export default CreateRoomScreen;
