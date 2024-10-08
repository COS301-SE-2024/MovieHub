import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { toggleMode } from "../Services/UsersApiService";
import { useUser } from "../Services/UseridContext";

function CustomDrawer({ route }) {
    // const { userInfo } = route.params;
    const { userInfo } = useUser();
    console.log(userInfo);
    const { isDarkMode, setMode, theme } = useTheme();
    const navigation = useNavigation();
    const handleToggleSwitch = async () => {
        try {
            const res = await toggleMode(userInfo.userId);
            console.log("Theme toggled", res.mode);
            setMode(res.mode);
            console.log(isDarkMode);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={{flex: 1}}>
        <ScrollView style={[styles.drawer, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.label, { color: theme.gray }]}>Your Account</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("AccountSettings", userInfo)}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="account-circle" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Account Settings</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            <Text style={[styles.label, { color: theme.gray }]}>Game</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("GameProfile", userInfo)}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="account-circle" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Movie Quote Challenge</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            {/* <Text style={[styles.label, { color: theme.gray }]}>Activity</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <IonIcon name="stats-chart-sharp" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Stats</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="settings" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Content Preferences</Text>
                </View>
            </TouchableOpacity> */}

            <View style={styles.line} />

            <Text style={[styles.label, { color: theme.gray }]}>Dark Mode</Text>
            <TouchableOpacity style={{ marginLeft: 20 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="dark-mode" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Enable Dark Mode</Text>
                    <Switch
                        style={{ marginLeft: "auto", marginRight: 10 }}
                        trackColor={{ false: "#767577", true: "#827DC3" }} 
                        thumbColor={isDarkMode ? "#4a42c0" : "#fff"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={handleToggleSwitch}
                        value={isDarkMode}
                    />
                </View>
            </TouchableOpacity>

            <View style={styles.line} />
            <Text style={[styles.label, { color: theme.gray }]}>About</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("PrivacyPolicy", userInfo)}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="policy" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Privacy Policy</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("TermsOfUse", userInfo)}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="description" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Terms of Use</Text>
                </View>
            </TouchableOpacity>
            
            <View style={styles.line} />
            <Text style={[styles.label, { color: theme.gray }]}>Info and Support</Text>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("HelpCentre", userInfo)}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="help" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Help Centre</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate("FAQs", userInfo)}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="info" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>FAQs</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            <View style={{ flex: 1 }} />

            <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate("LoginPage")}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Icon name="logout" style={[styles.icon, { color: theme.iconColor }]} size={24} />
                    <Text style={[styles.drawerItem, { color: theme.textColor }]}>Log Out</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
            </View>
    );
}

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        paddingTop: 100,
        // paddingBottom: 15,
        position: 'relative'
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
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
        marginVertical: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    logoutBtn: {    
        marginLeft: 20,
    },
});

export default CustomDrawer;
