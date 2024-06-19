import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import movie2 from "../../../assets/Assassin_movie.jpg";
import { useNavigation } from "@react-navigation/native";

export default function BottomHeader() {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => navigation.navigate("HomePage")}>
                    <Icon name="home" size={30} paddingLeft={10} style={styles.icon} />
                </TouchableOpacity>
                <Icon name="notifications" size={30} style={styles.icon} />
                <TouchableOpacity onPress={() => navigation.navigate("CreatePost")}>
                    <Icon name="add-circle-outline" size={35} style={styles.icon} />
                </TouchableOpacity>
                <Icon name="people" size={32} style={styles.icon} />
                <TouchableOpacity onPress={() => navigation.navigate("ProfilePage")}>
                    <Image source={{ uri: "https://i.pinimg.com/originals/30/98/74/309874f1a8efd14d0500baf381502b1b.jpg" }} size={30} style={styles.Image} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 65,
        paddingBottom: 10,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingRight: 10,
    },
    icon: {
        textAlign: "center",
        paddingTop: 6,
    },

    Image: {
        height: 40,
        width: 40,
        borderRadius: 20,
        paddingTop: 20,
    },
});
