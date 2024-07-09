import React, { useState } from "react";
import { View, Text, Modal, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import BottomHeader from "../Components/BottomHeader";
import { updateUserProfile } from "../Services/UsersApiService";

export default function EditProfile({route, userProfile }) {
    const {userInfo} = route.params;

    const [modalContent, setModalContent] = useState({
        username: { isVisible: false, newValue: "", tempValue: "" },
        fullName: { isVisible: false, newValue: "", tempValue: "" },
        currentlyWatching: { isVisible: false, newValue: "", tempValue: "" },
        bio: { isVisible: false, newValue: "", tempValue: "" },
        pronouns: { isVisible: false, newValue: "", tempValue: "", options: ["He/Him", "She/Her", "They/Them", "Prefer not to say"] },
        favoriteGenres: { isVisible: false, newValue: [], tempValue: [], options: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"] },
    });
    const [avatar, setAvatar] = useState("https://i.pinimg.com/originals/30/98/74/309874f1a8efd14d0500baf381502b1b.jpg");

    const username = userProfile?.username || "";
    const name = userProfile?.name || "";
    const bio = userProfile?.bio || "";
    const pronouns = userProfile?.pronouns || "";
    const currentlyWatching = userProfile?.currWatching || "";
    const favoriteGenres = userProfile?.favoriteGenres || [];

    const applyChanges = async (field) => {
        try {
            let updatedData = {};
            switch (field) {
                case "username":
                case "fullName":
                case "bio":
                case "pronouns":
                    updatedData[field] = modalContent[field].tempValue;
                    setModalContent({
                        ...modalContent,
                        [field]: {
                            ...modalContent[field],
                            isVisible: false,
                            newValue: modalContent[field].tempValue,
                        },
                    });
                    break;
                case "favoriteGenres":
                    updatedData[field] = modalContent[field].tempValue.slice(0, 3);
                    setModalContent({
                        ...modalContent,
                        [field]: {
                            ...modalContent[field],
                            isVisible: false,
                            newValue: modalContent[field].tempValue.slice(0, 3),
                        },
                    });
                    break;
                default:
                    break;
            }
            const userId = userInfo.userId;
            const updatedUser = await updateUserProfile(userId, updatedData);
            console.log("Update went well", updatedUser);

            setModalContent((prevState) => {
                const newState = { ...prevState };
                Object.keys(updatedData).forEach((key) => {
                    newState[key] = {
                        ...newState[key],
                        newValue: updatedUser[key],
                    };
                });
                return newState;
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
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

    const handleOptionPress = (field, option) => {
        if (field === "pronouns") {
            setModalContent({ ...modalContent, [field]: { ...modalContent[field], tempValue: option, isVisible: false, newValue: option } });
        } else if (field === "favoriteGenres") {
            const newOptions = [...modalContent[field].tempValue];
            if (newOptions.includes(option)) {
                newOptions.splice(newOptions.indexOf(option), 1);
            } else if (newOptions.length < 3) {
                newOptions.push(option);
            }
            setModalContent({ ...modalContent, [field]: { ...modalContent[field], tempValue: newOptions } });
        } else {
            const newOptions = [...modalContent[field].tempValue];
            if (newOptions.includes(option)) {
                newOptions.splice(newOptions.indexOf(option), 1);
            } else {
                newOptions.push(option);
            }
            setModalContent({ ...modalContent, [field]: { ...modalContent[field], tempValue: newOptions } });
        }
    };

    const selectImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true) {
            return;
        }
        setAvatar(pickerResult.assets[0].uri);
    };

    return (
        <ScrollView style={styles.container}>
            {/* <ScrollView> */}
                <Text style={{ color: "#7b7b7b", marginBottom: 20, marginTop: 20 }}>The information you enter here will be visible to other users.</Text>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <Text style={styles.buttonText} onPress={selectImage}>
                        Change Profile Picture
                    </Text>
                </View>

                {Object.keys(modalContent).map((field, index) => (
                    <View key={index}>
                        <TouchableOpacity onPress={() => handleFieldPress(field)}>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{field === "favoriteGenres" ? "Favorite Genres (Max 3)" : field === "currentlyWatching" ? "Currently Watching" : field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                {field === "favoriteGenres" ? (
                                    <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: "row" }}>
                                        {modalContent[field].newValue.map((option, index) => (
                                            <Text key={index} style={styles.chip}>
                                                {option}
                                            </Text>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <Text style={styles.sectionValue}>{modalContent[field].newValue}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                        <View style={styles.line} />
                    </View>
                ))}

                {Object.keys(modalContent).map((field, index) => (
                    <Modal key={index} animationType="fade" transparent={true} visible={modalContent[field].isVisible} onRequestClose={() => setModalContent({ ...modalContent, [field]: { ...modalContent[field], isVisible: false } })}>
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Change {field === "favoriteGenres" ? "Favorite Genres" : field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                {field === "favoriteGenres" ? (
                                    <View>
                                        <ScrollView style={{ maxHeight: 200 }}>
                                            {modalContent[field].options.map((option, index) => (
                                                <TouchableOpacity key={index} onPress={() => handleOptionPress(field, option)}>
                                                    <Text style={[styles.option, { backgroundColor: modalContent[field].tempValue.includes(option) ? "#7b7b7b" : "#ffffff", color: modalContent[field].tempValue.includes(option) ? "#ffffff" : "#000000" }]}>{option}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                        <View style={styles.buttonContainer}>
                                            <Text style={styles.buttonText} onPress={handleCancelChanges}>
                                                Cancel
                                            </Text>
                                            <Text style={styles.buttonText} onPress={() => applyChanges(field)}>
                                                Apply Changes
                                            </Text>
                                        </View>
                                    </View>
                                ) : field === "pronouns" ? (
                                    <ScrollView>
                                        {modalContent[field].options.map((option, index) => (
                                            <TouchableOpacity key={index} onPress={() => handleOptionPress(field, option)}>
                                                <Text style={[styles.option, { backgroundColor: modalContent[field].tempValue === option ? "#7b7b7b" : "#ffffff", color: modalContent[field].tempValue === option ? "#ffffff" : "#000000" }]}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <View>
                                        <TextInput style={styles.input} autoFocus={true} placeholder={modalContent[field].newValue} value={modalContent[field].tempValue} onChangeText={(text) => handleInputChange(field, text)} />
                                        <View style={styles.buttonContainer}>
                                            <Text style={styles.buttonText} onPress={handleCancelChanges}>
                                                Cancel
                                            </Text>
                                            <Text style={styles.buttonText} onPress={() => applyChanges(field)}>
                                                Apply Changes
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    </Modal>
                ))}
            {/* </ScrollView> */}
            {/* <BottomHeader /> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 30,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    sectionValue: {
        fontSize: 16,
        marginTop: 5,
        color: "#7b7b7b",
    },
    line: {
        height: 1,
        backgroundColor: "lightgray",
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
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#7b7b7b",
        outlineStyle: "none",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 10,
    },
    buttonText: {
        color: "#0f5bd1",
        textAlign: "center",
    },
    option: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#d9d9d9",
        color: "#007bff",
    },
    chip: {
        padding: 8,
        margin: 4,
        borderRadius: 10,
        backgroundColor: "#7b7b7b",
        color: "#fff",
    },
});
