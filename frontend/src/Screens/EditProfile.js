import React, { useEffect, useState } from "react";
import { View, Text, Modal, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView,Button,Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import BottomHeader from "../Components/BottomHeader";
import { updateUserProfile } from "../Services/UsersApiService";
import { colors, themeStyles } from '../styles/theme';
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import { uploadImage } from '../Services/imageUtils';

export default function EditProfile({ route }) {
    const { userInfo } = route.params;
    const { userProfile } = route.params;
    const { theme } = useTheme();
    const [avatar, setAvatar] = useState(userProfile.avatar);
    const [avatarChanged, setAvatarChanged] = useState(false);
    const [uploading, setUploading] = useState(false);

    const navigation = useNavigation();

    const defaultUserProfile = {
        username: "",
        name: "",
        bio: "",
        pronouns: "",
        favouriteGenres: [],
        ...userProfile
    };

    const [modalContent, setModalContent] = useState({
        username: { isVisible: false, newValue: defaultUserProfile.username, tempValue: "" },
        name: { isVisible: false, newValue: defaultUserProfile.name, tempValue: "" },
        currentlyWatching: { isVisible: false, newValue: "", tempValue: "" },
        bio: { isVisible: false, newValue: defaultUserProfile.bio, tempValue: "" },
        pronouns: { isVisible: false, newValue: defaultUserProfile.pronouns, tempValue: "", options: ["He/Him", "She/Her", "They/Them", "Prefer not to say"] },
        favouriteGenres: { isVisible: false, newValue: defaultUserProfile.favoriteGenres, tempValue: [], options: ["Action", "Adventure", "Animation", "Comedy", "Drama", "Documentary", "Fantasy", "History", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "War"] },
    });

    const applyChanges = async (field) => {
        try {
            let updatedData = {};
            switch (field) {
                case "username":
                case "name":
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
                case "favouriteGenres":
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
                case "avatar":
                    updatedData[field] = avatar;
                    break;
                default:
                    break;
            }
            const userId = userInfo.userId;
            const updatedUser = await updateUserProfile(userId, updatedData);
            
            setModalContent((prevState) => {
                const newState = { ...prevState };
                Object.keys(updatedData).forEach((key) => {
                    if (key !== 'avatar') {
                        newState[key] = {
                            ...newState[key],
                            newValue: updatedUser[key],
                        };
                    }
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
            updatedContent[field] = { ...modalContent[field], tempValue: modalContent[field].tempValue, isVisible: false };
        });
        setModalContent(updatedContent);
    };

    const handleFieldPress = (field) => {
        setModalContent({ ...modalContent, [field]: { ...modalContent[field], isVisible: true } });
    };

    const handleInputChange = (field, value) => {
        setModalContent({ ...modalContent, [field]: { ...modalContent[field], tempValue: value } });
    };

    const applyAllChanges = async () => {
        try {
            const updatedData = {};
            Object.keys(modalContent).forEach((field) => {
                if (field === "favouriteGenres") {
                    updatedData[field] = modalContent[field].tempValue.slice(0, 3);
                } else if (modalContent[field].tempValue) {
                    updatedData[field] = modalContent[field].tempValue;
                }
            });
            
            const userId = userInfo.userId;
            const updatedUser = await updateUserProfile(userId, updatedData);
            Alert.alert('Success', 'Profile updated successfully!');
    
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

    const handleOptionPress = (field, option) => {
        if (field === "pronouns") {
            setModalContent({ ...modalContent, [field]: { ...modalContent[field], tempValue: option, isVisible: false, newValue: option } });
            // update field 
        } else if (field === "favouriteGenres") {
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
        const { uri } = pickerResult.assets[0];
        const name = pickerResult.assets[0].fileName;
        const avatarUrl = await uploadImage(uri, name, 'profile');
        setAvatar(uri);   
        setAvatarChanged(true);
    };

    useEffect(() => {
        if (avatarChanged) {
            // Call applyChanges only after avatar state is updated
            applyChanges('avatar');
            setAvatarChanged(false);
        }
    }, [avatar, avatarChanged]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
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
            borderColor: theme.primaryColor,
            borderWidth: 1,
        },
        section: {
            marginBottom: 20,
        },
        changePictureText: {
            color: colors.primary, // Set the desired color here
            fontSize: 16, 
            fontWeight: 'bold', 
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
        },
        sectionValue: {
            fontSize: 16,
            marginTop: 8,
            color: theme.gray,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 10,
        },
        buttonText: {
            color: "#000",
            textAlign: "center",
            color: theme.textColor
        },
        entryButton: {
            backgroundColor: theme.primaryColor,
            padding: 16,
            borderRadius: 4,
            alignItems: "center",
            marginBottom: 20,
        },
        entryButtonText: {
            color: theme.textColor,
            fontSize: 16,
            fontWeight: "medium",
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
            backgroundColor: theme.textColor,
            padding: 20,
            borderRadius: 10,
            width: "80%",
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 20,
            color: theme.textColor
        },
        input: {
            marginBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.gray,
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
            borderColor: theme.borderColor,
            color: "#007bff",
        },
        chip: {
            padding: 10,
            margin: 6,
            borderRadius: 10,
            backgroundColor: theme.primaryColor,
            color: theme.textColor,
        },
    });

    return (
        <ScrollView style={styles.container}>
            <Text style={{ color: theme.gray, marginBottom: 20, marginTop: 20 }}>The information you enter here will be visible to other users.</Text>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <Text onPress={selectImage} style={styles.changePictureText}>
                    Change Profile Picture
                </Text>
            </View>

            {Object.keys(modalContent).map((field, index) => (
                <View key={index}>
                    <TouchableOpacity onPress={() => handleFieldPress(field)}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{field === "favouriteGenres" ? "Favorite Genres (Max 3)" : field === "currentlyWatching" ? "Currently Watching" : field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            {field === "favouriteGenres" ? (
                                <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: "row", paddingTop: 10 }}>
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
                            <Text style={styles.modalTitle}>Change {field === "favouriteGenres" ? "Favorite Genres" : field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            {field === "favouriteGenres" ? (
                                <View>
                                    <ScrollView style={{ maxHeight: 200 }}>
                                        {modalContent[field].options.map((option, index) => (
                                            <TouchableOpacity key={index} onPress={() => handleOptionPress(field, option)}>
                                                <Text style={[styles.option, { backgroundColor: modalContent[field].tempValue.includes(option) ? theme.primaryColor : "#ffffff", color: modalContent[field].tempValue.includes(option) ? "#ffffff" : "#000000" }]}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText} onPress={handleCancelChanges}>
                                            Cancel
                                        </Text>
                                        <Text style={styles.buttonText} onPress={() => applyChanges(field)}>
                                            Change
                                        </Text>
                                    </View>
                                </View>
                            ) : field === "pronouns" ? (
                                <ScrollView>
                                    {modalContent[field].options.map((option, index) => (
                                        <TouchableOpacity key={index} onPress={() => handleOptionPress(field, option)}>
                                            <Text style={[styles.option, { backgroundColor: modalContent[field].tempValue === option ? theme.primaryColor : "#ffffff", color: modalContent[field].tempValue === option ? "#ffffff" : "#000000" }]}>{option}</Text>
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
                                            Change
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            ))}
            <TouchableOpacity style={styles.entryButton} onPress={applyAllChanges}>
                <Text style={styles.entryButtonText}>Save All Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}


