import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { deleteUserProfile } from "../Services/UsersApiService";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../styles/ThemeContext";

export default function AccountSettings({ route }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [deletedModalVisible, setDeletedModalVisible] = useState(false);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const confirmDeleteAccount = () => {
        setModalVisible(true);
    };

    const handleDeleteAccount = async () => {
        try {
            // Call the deleteUserAccount function from UsersApiService
            const userId = "tempUserAgain";
            const response = await deleteUserProfile(userId);
            if (response.success) {
                // If the account deletion was successful, navigate the user to the login screen or any other appropriate screen
                setDeletedModalVisible(true);
                setTimeout(() => {
                    setDeletedModalVisible(false);
                    navigation.navigate("SignupPage");
                }, 2000);
            } else {
                // If there was an error deleting the account, display an error message to the user
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        setting: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: "transparent",
        },
        settingName: {
            fontSize: 16,
            color: theme.textColor,
        },
        deleteButton: {
            padding: 15,
            marginTop: 20,
            borderRadius: 5,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            backgroundColor: theme.backgroundColor,
        },
        deleteButtonText: {
            color: "#ff0000",
            textAlign: "center",
            fontWeight: "bold",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // padding: 16,
            fontSize: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
        },
        modalOverlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            height: "100%",
        },
        modalContainer: {
            width: "80%",
            backgroundColor: theme.backgroundColor,
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            color: theme.textColor,
        },
        modalMessage: {
            fontSize: 16,
            textAlign: "center",
            marginBottom: 20,
            color: theme.textColor,
        },
        modalActions: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
        },
        modalButton: {
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
            marginHorizontal: 5,
        },
        modalButtonText: {
            fontSize: 16,
            color: theme.textColor,
        },
        modalButtonDelete: {
        },
        modalButtonDeleteText: {
            color: "red",
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.setting} onPress={() => navigation.navigate("ChangePassword")}>
                <Text style={styles.settingName}>Change password</Text>
                <Icon name="keyboard-arrow-right" size={24} color={theme.textColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.setting} onPress={() => navigation.navigate("UpdateEmail")}>
                <Text style={styles.settingName}>Update email address</Text>
                <Icon name="keyboard-arrow-right" size={24} color={theme.textColor}  />
            </TouchableOpacity>
            <TouchableOpacity style={styles.setting} onPress={() => navigation.navigate("AccountPrivacy")}>
                <Text style={styles.settingName}>Account Privacy</Text>
                <Icon name="keyboard-arrow-right" size={24} color={theme.textColor}  />
            </TouchableOpacity>
            <TouchableOpacity style={styles.setting} onPress={confirmDeleteAccount}>
                <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={confirmDeleteAccount} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity> */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={deletedModalVisible}
                onRequestClose={() => {
                    setDeletedModalVisible(!deletedModalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Account Deleted</Text>
                        <Text style={styles.modalMessage}>Your account has been successfully deleted.</Text>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                        <Text style={styles.modalMessage}>If you delete your account, you will permanently lose all your data and it will not be recoverable.</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeleteAccount} style={[styles.modalButton, styles.modalButtonDelete]}>
                                <Text style={[styles.modalButtonText, styles.modalButtonDeleteText]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

