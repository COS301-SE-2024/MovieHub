// CustomDrawer.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";

const CustomDrawer = ({ navigation, closeDrawer }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={styles.drawer}>
            <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>
                    <Icon name="close" size={24} />
                </Text>
            </TouchableOpacity>
            <Text style={styles.label}>Your Acount</Text>
            <TouchableOpacity onPress={() => navigation.navigate("")}>
                <Text style={styles.drawerItem}>Account Settings</Text>
            </TouchableOpacity>
            <View style={styles.line} />
    
            <Text style={styles.label}>About</Text>
            <TouchableOpacity onPress={() => navigation.navigate("")}>
                <Text style={styles.drawerItem}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("")}>
                <Text style={styles.drawerItem}>Terms and Conditions</Text>
            </TouchableOpacity>
            <View style={styles.line} />

            <Text style={styles.label}>Dark Mode</Text>
            <TouchableOpacity style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.drawerItem}>Enable Dark Mode </Text>
                {/* add toggle switch */}
                <Switch trackColor={{ false: "#ccc", true: "#808080" }} thumbColor={isEnabled ? "#fff" : "#fff"} ios_backgroundColor="#3e3e3e" onValueChange={toggleSwitch} value={isEnabled} />
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <Text style={styles.drawerItem}>Log out</Text>
            
        </View>
    );
};

const styles = StyleSheet.create({
    drawer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width: Dimensions.get("window").width,
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 38,
        paddingBottom: 15, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        
    },
    closeButton: {
        alignSelf: "flex-end",
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        paddingHorizontal: 18,
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
        paddingHorizontal: 20,
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
});

export default CustomDrawer;
