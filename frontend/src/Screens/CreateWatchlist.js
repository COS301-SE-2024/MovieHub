import React, { useState } from "react";
import { View, Text, Modal, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Switch, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../styles/theme";
import { useTheme } from "../styles/ThemeContext";

export default function CreateWatchlist({ route, navigation }) {
    //Use userInfo to personlise a users homepage
    const { userInfo } = route.params;
    const { theme } = useTheme();

    const [modalContent, setModalContent] = useState({
        name: { isVisible: false, newValue: "", tempValue: "" },
        description: { isVisible: false, newValue: "", tempValue: "" },
        tags: { isVisible: false, newValue: "", tempValue: "" },
    });
    const [cover, setCover] = useState(null);
    const [visibility, setVisibility] = useState(false);
    const [collaborative, setCollaborative] = useState(false);
    const [ranked, setRanked] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [showUserSearch, setShowUserSearch] = useState(false);
    const allUsers = [
        // { id: 1, name: "John Doe" },
        // { id: 2, name: "Jane Smith" },
        // { id: 3, name: "Alice Johnson" },
        // { id: 4, name: "Bob Williams" },
        // { id: 5, name: "Charlie Brown" },
    ];
    const chooseCover = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true) {
            return;
        }

        setCover(pickerResult.assets[0].uri);
    };

    const applyChanges = (field) => {
        setModalContent({
            ...modalContent,
            [field]: {
                ...modalContent[field],
                isVisible: false,
                newValue: modalContent[field].tempValue,
            },
        });
    };

    const handleCancelChanges = () => {
        const updatedContent = {};
        Object.keys(modalContent).forEach((field) => {
            updatedContent[field] = { ...modalContent[field], tempValue: modalContent[field].newValue, isVisible: false };
        });
        setModalContent(updatedContent);
    };

    const handleFieldPress = (field) => {
        setModalContent({ ...modalContent, [field]: { ...modalContent[field], isVisible: true } });
    };

    const handleInputChange = (field, value) => {
        setModalContent({ ...modalContent, [field]: { ...modalContent[field], tempValue: value } });
    };

    const handleNext = () => {
        const watchlistData = {
            name: modalContent.name.newValue,
            description: modalContent.description.newValue,
            tags: modalContent.tags.newValue,
            img: cover,
            visibility,
            collaborative,
            ranked,
            // invitedUsers: collaborative ? invitedUsers : [],
            // cover,
        };

        navigation.navigate("AddMovies", { watchlistData, userInfo });
    };

    const handleCollaborativeToggle = (value) => {
        setCollaborative(value);
        if (value) {
            setShowUserSearch(true);
        } else {
            setShowUserSearch(false);
            setInvitedUsers([]);
        }
    };

    const handleUserSearch = (text) => {
        setSearchQuery(text);
    };

    const inviteUser = (user) => {
        if (!invitedUsers.some((invited) => invited.id === user.id)) {
            setInvitedUsers([...invitedUsers, user]);
        }
    };

    const removeInvitedUser = (userId) => {
        setInvitedUsers(invitedUsers.filter((user) => user.id !== userId));
    };

    const filteredUsers = allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
            paddingHorizontal: 30,
        },
        coverContainer: {
            width: 200,
            height: 200,
            backgroundColor: "#e1e1e1",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            alignSelf: "center",
        },
        coverImage: {
            width: "100%",
            height: "100%",
        },
        coverText: {
            color: "#666",
        },
        section: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
        },
        sectionValue: {
            fontSize: 16,
            marginTop: 5,
            color: theme.gray,
        },
        line: {
            height: 1,
            backgroundColor: theme.borderColor,
            width: "100%",
            marginBottom: 20,
        },
        modalBackground: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            backgroundColor: theme.backgroundColor,
            padding: 20,
            borderRadius: 10,
            width: "80%",
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 20,
            color: theme.textColor,
        },
        input: {
            marginBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
            outlineStyle: "none",
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10,
        },
        buttonText: {
            color: theme.primaryColor,
            textAlign: "center",
        },
        switchContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        nextButton: {
            backgroundColor: theme.primaryColor,
            padding: 16,
            borderRadius: 4,
            alignItems: "center",
        },
        nextButtonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
        },
        searchBar: {
            backgroundColor: theme.inputBackground,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            color: theme.textColor,
        },
        userItem: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        invitedUserItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            backgroundColor: theme.secondaryBackground,
            borderRadius: 5,
            marginBottom: 5,
        },
        removeButton: {
            color: theme.dangerColor,
        },
    });

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.coverContainer} onPress={chooseCover}>
                {cover ? <Image source={{ uri: cover }} style={styles.coverImage} /> : <Text style={styles.coverText}>Choose cover</Text>}
            </TouchableOpacity>

            {Object.keys(modalContent).map((field, index) => (
                <View key={index}>
                    <TouchableOpacity onPress={() => handleFieldPress(field)}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            <Text style={styles.sectionValue}>{modalContent[field].newValue}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.line} />
                </View>
            ))}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Visibility</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.sectionValue}>{visibility ? "Public" : "Private"}</Text>
                    <Switch value={visibility} onValueChange={setVisibility} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={visibility ? "#4A42C0" : "#fff"} />
                </View>
            </View>
            <View style={styles.line} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Collaborative</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.sectionValue}> {collaborative ? "Yes" : "No"} </Text>
                    <Switch value={collaborative} onValueChange={handleCollaborativeToggle} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={collaborative ? "#4A42C0" : "#fff"} />
                </View>
            </View>
            <View style={styles.line} />

            {showUserSearch && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Invite Users</Text>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search users..."
                        placeholderTextColor={theme.placeholderColor}
                        value={searchQuery}
                        onChangeText={handleUserSearch}
                    />
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.userItem}
                                onPress={() => inviteUser(item)}
                            >
                                <Text style={{ color: theme.textColor }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                        Invited Users
                    </Text>
                    {invitedUsers.map((user) => (
                        <View key={user.id} style={styles.invitedUserItem}>
                            <Text style={{ color: theme.textColor }}>{user.name}</Text>
                            <TouchableOpacity onPress={() => removeInvitedUser(user.id)}>
                                <Text style={styles.removeButton}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ranked</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.sectionValue}>{ranked ? "Yes" : "No"}</Text>
                    <Switch value={ranked} onValueChange={setRanked} trackColor={{ false: "#767577", true: "#827DC3" }} thumbColor={ranked ? "#4A42C0" : "#fff"} />
                </View>
            </View>
            <View style={styles.line} />
            
            {Object.keys(modalContent).map((field, index) => (
                <Modal
                    key={index}
                    animationType="fade"
                    transparent={true}
                    visible={modalContent[field].isVisible}
                    onRequestClose={() =>
                        setModalContent({
                            ...modalContent,
                            [field]: { ...modalContent[field], isVisible: false },
                        })
                    }>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add {field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            <TextInput style={styles.input} autoFocus={true} placeholder={modalContent[field].newValue} value={modalContent[field].tempValue} onChangeText={(text) => handleInputChange(field, text)} selectionColor={theme.textColor} color={theme.textColor} />
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText} onPress={handleCancelChanges}>
                                    Cancel
                                </Text>
                                <Text style={styles.buttonText} onPress={() => applyChanges(field)}>
                                    Save
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            ))}

            <View style={{ marginBottom: 20 }}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
