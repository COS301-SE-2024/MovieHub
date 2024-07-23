import React, { useState } from "react";
import { View, Text, Modal, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Switch } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CreateWatchlist({route,  navigation }) {
    //Use userInfo to personlise a users homepage
    const { userInfo } = route.params;

    const [modalContent, setModalContent] = useState({
        name: { isVisible: false, newValue: "", tempValue: "" },
        description: { isVisible: false, newValue: "", tempValue: "" },
        tags: { isVisible: false, newValue: "", tempValue: "" },
    });
    const [cover, setCover] = useState(null);
    const [visibility, setVisibility] = useState(true);
    const [collaborative, setCollaborative] = useState(false);
    const [ranked, setRanked] = useState(false);

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
            visibility,
            collaborative,
            ranked,
           // cover,
        };

        navigation.navigate('AddMovies', { watchlistData, userInfo });
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.coverContainer} onPress={chooseCover}>
                {cover ? (
                    <Image source={{ uri: cover }} style={styles.coverImage} />
                ) : (
                    <Text style={styles.coverText}>Choose cover</Text>
                )}
            </TouchableOpacity>

            {Object.keys(modalContent).map((field, index) => (
                <View key={index}>
                    <TouchableOpacity onPress={() => handleFieldPress(field)}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </Text>
                            <Text style={styles.sectionValue}>{modalContent[field].newValue}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.line} />
                </View>
            ))}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Visibility</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.sectionValue}>{visibility ? "Private" : "Public"}</Text>
                    <Switch value={visibility} onValueChange={setVisibility} thumbColor={visibility ? "white" : "black"} />
                </View>
            </View>
            <View style={styles.line} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Collaborative</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.sectionValue}>{collaborative ? "Yes" : "No"}</Text>
                    <Switch value={collaborative} onValueChange={setCollaborative} thumbColor={visibility ? "grey" : "black"} />
                </View>
            </View>
            <View style={styles.line} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ranked</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.sectionValue}>{ranked ? "Yes" : "No"}</Text>
                    <Switch value={ranked} onValueChange={setRanked} thumbColor={visibility ? "grey" : "black"} />
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
                    }
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                Change {field.charAt(0).toUpperCase() + field.slice(1)}
                            </Text>
                            <TextInput
                                style={styles.input}
                                autoFocus={true}
                                placeholder={modalContent[field].newValue}
                                value={modalContent[field].tempValue}
                                onChangeText={(text) => handleInputChange(field, text)}
                            />
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText} onPress={handleCancelChanges}>
                                    Cancel
                                </Text>
                                <Text style={styles.buttonText} onPress={() => applyChanges(field)}>
                                    Apply Changes
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            ))}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    nextButton: {
        backgroundColor: "black",
        padding: 16,
        borderRadius: 4,
        alignItems: "center",
    },
    nextButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
