// CustomDrawer.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import { deleteUserProfile } from "../Services/UsersApiService";

function CustomDrawer({ navigation, closeDrawer }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [deletedModalVisible, setDeletedModalVisible] = useState(false);

    const confirmDeleteAccount = () => {
        setModalVisible(true);
    };

    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const navigateTo = (screen) => {
        navigation.navigate(screen);
        setTimeout(() => {
            closeDrawer();
        }, 300);
    };
    const handleDeleteAccount = async () => {
        try {
            // Call the deleteUserAccount function from UsersApiService
            const userId = "tempUserAgain";
            const response = await deleteUserProfile(userId);
            console.log(response);
            if (response.success) {
                // If the account deletion was successful, navigate the user to the login screen or any other appropriate screen @asa-siphuma
                setDeletedModalVisible(true);
                setTimeout(() => {
                    setDeletedModalVisible(false);
                    navigateTo("SignupPage");
                }, 2000);
            } else {
                // If there was an error deleting the account, display an error message to the user
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            // Handle any unexpected errors (e.g., network errors)
            // You can display an error message to the user or handle the error in any other way
        }
    };

    return (
        <ScrollView style={styles.drawer}>
            <Text style={styles.label}>Your Acount</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="account-circle" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Account Settings</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            <Text style={styles.label}>Activity</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="bookmark" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Saved</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <IonIcon name="stats-chart-sharp" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Stats</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="settings" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Content Preferences</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            <Text style={styles.label}>Dark Mode</Text>
            <TouchableOpacity style={{ marginLeft: 20 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="dark-mode" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Enable Dark Mode</Text>
                    <Switch style={{ marginLeft: "auto" }} trackColor={{ false: "#ccc", true: "#808080" }} thumbColor={isEnabled ? "#fff" : "#fff"} ios_backgroundColor="#3e3e3e" onValueChange={toggleSwitch} value={isEnabled} />
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            <Text style={styles.label}>About</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigateTo("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="policy" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Privacy Policy</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="description" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Terms and Conditions</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />
            <Text style={styles.label}>Notifications</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="notifications" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Configure Notifications</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />
            <Text style={styles.label}>Info and Support</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("HelpCentre")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="help" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Help Centre</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("FAQs")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="info" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>FAQs</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            <View style={{ flex: 1 }} />

            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="logout" style={styles.icon} size={24} />
                    <Text style={styles.drawerItem}>Log Out</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDeleteAccount} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={deletedModalVisible}
                onRequestClose={() => {
                    setDeletedModalVisible(!deletedModalVisible);
                }}></Modal>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Deletion</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to delete your account?</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeleteAccount} style={[styles.modalButton, styles.modalButtonDelete]}>
                                <Text style={[styles.modalButtonText, styles.modalButtonDeleteText]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>-
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 25,
        paddingBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#7b7b7b",
        paddingHorizontal: 20,
    },
    drawerItem: {
        fontSize: 16,
        marginVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    line: {
        height: 1,
        backgroundColor: "lightgray",
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    deleteButton: {
        backgroundColor: "red",
        padding: 10,
        margin: 20,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
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
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
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
    },
    modalButtonDelete: {
        backgroundColor: "red",
    },
    modalButtonDeleteText: {
        color: "#fff",
    },
});

export default CustomDrawer;
