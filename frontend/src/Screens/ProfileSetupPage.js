import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable, ScrollView, Modal, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../styles/ThemeContext";
import { updateUserProfile } from "../Services/UsersApiService";

const pronounsOptions = ["He/Him", "She/Her", "They/Them", "Prefer not to say"];
const genreOptions = ["Action", "Adventure", "Animation", "Comedy", "Drama", "Documentary", "Fantasy", "History", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "War"];
const defaultAvatar = "https://img.icons8.com/?size=100&id=ckaioC1qqwCu&format=png&color=7950F2"; // Placeholder image URL

const ProfileSetupPage = ({ route }) => {
    const { userInfo } = route.params || "";
    const { theme } = useTheme();
    const [avatar, setAvatar] = useState(defaultAvatar);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [favouriteGenres, setfavouriteGenres] = useState([]);
    const [error, setError] = useState("");
    const [modalVisible, setModalVisible] = useState({ pronouns: false, favoriteGenres: false });

    const navigation = useNavigation();

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

    const removeImage = () => {
        setAvatar(defaultAvatar);
    };

    const handleGenreSelect = (genre) => {
        const newGenres = [...favouriteGenres];
        if (newGenres.includes(genre)) {
            const index = newGenres.indexOf(genre);
            newGenres.splice(index, 1);
        } else if (newGenres.length < 3) {
            newGenres.push(genre);
        }
        setfavouriteGenres(newGenres);
    };

    const handlePronounsSelect = (option) => {
        setPronouns(option);
        setModalVisible({ ...modalVisible, pronouns: false });
    };

    const handleSubmit = async () => {
        if (!name) {
            setError("Please enter a name");
            return;
        }

        setError("");
        console.log({ name, bio, pronouns, favouriteGenres, userInfo, avatar });
        const updatedData = { avatar, name, bio, pronouns, favouriteGenres };
        const updatedUser = await updateUserProfile(userInfo.userId, updatedData);
        console.log("Update went well", updatedUser);

        userInfo.updatedData = updatedData;

        navigation.navigate("Home", { userInfo });
    };

    const styles = StyleSheet.create({
        title: {
            textAlign: "center",
            fontFamily: "Roboto",
            color: "#000000",
            fontSize: 25,
            fontWeight: "bold",
            paddingBottom: 15,
        },
        avatarContainer: {
            alignItems: "center",
            marginBottom: 20,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#e0e0e0", // placeholder background color
        },
        removeButton: {
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "black",
            borderRadius: 15,
            width: 25,
            height: 25,
            justifyContent: "center",
            alignItems: "center",
        },
        removeButtonText: {
            color: "#fff",
            fontWeight: "bold",
        },
        logo: {
            textAlign: "center",
            fontFamily: "Roboto",
            color: "#000000",
            fontSize: 20,
            fontWeight: "bold",
        },
        inputText: {
            height: 40,
            width: 250,
            borderColor: theme.borderColor,
            borderWidth: 1,
            paddingHorizontal: 10,
            fontSize: 16,
            color: "#000",
            backgroundColor: "#fff",
            borderRadius: 5,
            marginBottom: 5,
        },
        container: {
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            backgroundColor: theme.backgroundColor,
            paddingVertical: 50,
        },
        label: {
            fontWeight: "bold",
            paddingBottom: 8,
            paddingTop: 20,
        },
        btn: {
            width: 250,
        },
        button: {
            backgroundColor: theme.primaryColor,
            padding: 10,
            borderRadius: 5,
            width: 250,
            marginTop: 25,
        },
        selectText: {
            height: 40,
            width: 250,
            borderColor: theme.gray,
            borderWidth: 1,
            paddingHorizontal: 10,
            fontSize: 16,
            color: theme.gray,
            backgroundColor: "#fff",
            borderRadius: 5,
            textAlignVertical: "center",
            marginBottom: 5,
        },
        chip: {
            padding: 10,
            margin: 4,
            borderRadius: 10,
            backgroundColor: theme.primaryColor,
            color: "white",
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
            fontWeight: "semibold",
            marginBottom: 20,
            color: theme.primaryColor,
            textAlign: "left",
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
        textArea: {
            height: 100,
            textAlignVertical: "top",
            paddingTop: 8,
        },
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <View style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    {avatar !== defaultAvatar && (
                        <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                            <Icon name="close" size={15} style={styles.removeButtonText} />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={[styles.buttonText, { paddingTop: 10 }]} onPress={selectImage}>
                    Change Profile Picture
                </Text>
            </View>
            <View>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.inputText} onChangeText={setName} value={name} placeholder="Enter your name" />
                {error ? <Text style={{ color: "red", marginTop: 10, textAlign: "left" }}>{error}</Text> : null}
            </View>
            <View>
                <Text style={styles.label}>Bio</Text>
                <TextInput style={[styles.inputText, styles.textArea]} onChangeText={setBio} value={bio} placeholder="Tell us about yourself" multiline />
            </View>
            <View>
                <Text style={styles.label}>Pronouns</Text>
                <TouchableOpacity onPress={() => setModalVisible({ ...modalVisible, pronouns: true })}>
                    <Text style={styles.selectText}>{pronouns || "Select pronouns"}</Text>
                </TouchableOpacity>
                <Modal visible={modalVisible.pronouns} transparent={true} onRequestClose={() => setModalVisible({ ...modalVisible, pronouns: false })}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Pronouns</Text>
                            {pronounsOptions.map((option) => (
                                <TouchableOpacity key={option} onPress={() => handlePronounsSelect(option)}>
                                    <Text style={[styles.option, { backgroundColor: pronouns === option ? theme.primaryColor : "#ffffff", color: pronouns === option ? "#ffffff" : "#000000" }]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText} onPress={() => setModalVisible({ ...modalVisible, pronouns: false })}>
                                    Cancel
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View>
                <Text style={styles.label}>Favorite Genres</Text>

                <TouchableOpacity onPress={() => setModalVisible({ ...modalVisible, favoriteGenres: true })}>
                    <Text style={styles.selectText}>Select up to 3 genres</Text>
                </TouchableOpacity>

                <View horizontal={true} contentContainerStyle={{ flexDirection: "row" }}>
                    {favouriteGenres.map((option, index) => (
                        <Text key={index} style={styles.chip}>
                            {option}
                        </Text>
                    ))}
                </View>

                <Modal visible={modalVisible.favoriteGenres} transparent={true} onRequestClose={() => setModalVisible({ ...modalVisible, favoriteGenres: false })}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Favorite Genres</Text>
                            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                                {genreOptions.map((option) => (
                                    <TouchableOpacity key={option} onPress={() => handleGenreSelect(option)}>
                                        <Text style={[styles.option, { backgroundColor: favouriteGenres.includes(option) ? theme.primaryColor : "#ffffff", color: favouriteGenres.includes(option) ? "#ffffff" : "#000000" }]}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText} onPress={() => setModalVisible({ ...modalVisible, favoriteGenres: false })}>
                                    Done
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>

            <View style={styles.btn}>
                <Pressable style={styles.button} onPress={handleSubmit}>
                    <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Done</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default ProfileSetupPage;
