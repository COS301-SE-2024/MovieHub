import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const WatchPartyHeader = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} />
                </Pressable>
            </View>
            <View>
                <Icon name="more-horiz" size={24} style={{ marginRight: 10 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 70,
        paddingTop: 38,
        marginBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10
    },
    roomName: {
        marginLeft: 28,
        fontSize: 20,
        fontWeight: "500",
    }
});

export default WatchPartyHeader;
