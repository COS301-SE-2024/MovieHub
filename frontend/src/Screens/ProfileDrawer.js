// CustomDrawer.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useState } from "react";

import { useTheme } from "../styles/ThemeContext";

function CustomDrawer({ navigation }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const { theme } = useTheme();

    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const handleToggleSwitch = () => {
        toggleTheme();
    };

    return (
        <ScrollView style={[styles.drawer, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.label, { color: theme.gray }]}>Your Acount</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("AccountSettings")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="account-circle" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Account Settings</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            <Text style={[styles.label, { color: theme.gray }]}>Activity</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="bookmark" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Saved</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <IonIcon name="stats-chart-sharp" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Stats</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="settings" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Content Preferences</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.line} />

            <Text style={[styles.label, { color: theme.gray }]}>Dark Mode</Text>
            <TouchableOpacity style={{ marginLeft: 20 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="dark-mode" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Enable Dark Mode</Text>
                    <Switch testID="dark-mode-switch" style={{ marginLeft: "auto", marginRight: 10 }} trackColor={{ false: "#ccc", true: "#808080" }} thumbColor={isDarkMode ? "#fff" : "#fff"} ios_backgroundColor="#3e3e3e" onValueChange={handleToggleSwitch} value={isEnabled} />
                </View>
            </TouchableOpacity>

            <View style={styles.line} />
            
            <Text style={[styles.label, { color: theme.gray }]}>Notifications</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="notifications" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Configure Notifications</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.line} />
            <Text style={[styles.label, { color: theme.gray }]}>About</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("PrivacyPolicy")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="policy" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Privacy Policy</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("TermsOfUse")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="description" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Terms of Use</Text>
                </View>
            </TouchableOpacity>
            
            <View style={styles.line} />
            <Text style={[styles.label, { color: theme.gray }]}>Info and Support</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("HelpCentre")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="help" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Help Centre</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("FAQs")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="info" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>FAQs</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            <View style={{ flex: 1 }} />

            <TouchableOpacity style={ styles.logoutBtn } onPress={() => navigation.navigate("LoginPage")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="logout" style={[styles.icon, {color: theme.iconColor}]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Log Out</Text>
                </View>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 20,
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
        backgroundColor: "#e0e0e0",
        marginVertical: 5,
        shadowColor: "#e0e0e0",
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
    logoutBtn: {    
        marginLeft: 20,
    },
});

export default CustomDrawer;