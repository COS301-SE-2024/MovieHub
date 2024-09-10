import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

const UserRoomCard = ({ roomName, users, live, handlePress, keyword, coverImage }) => {
    const [randomImage, setRandomImage] = useState(coverImage);
    const [fallbackColor, setFallbackColor] = useState("black");

    // Function to generate a random color, excluding white
    const getRandomColor = () => {
        const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFAF33", "#57FF33", "#FF5733", "#5733FF", "#33FFA1", "#A133FF", "#FF5733", "#57A1FF", "#FF3357", "#57FF33"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <TouchableOpacity style={styles.userRoomCard} onPress={handlePress}>
            <ImageBackground
                source={randomImage ? { uri: randomImage } : null}
                style={[styles.imageBackground, { backgroundColor: fallbackColor }]}
                imageStyle={{ borderRadius: 8 }}
            >
                <View style={styles.overlay}>
                    {live && <Text style={styles.liveText}>● Active</Text>}
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>{roomName}</Text>
                        <View style={styles.cardFooter}>
                            <Icon name="users" size={16} color="white" />
                            <Text style={styles.userCount}>{users}</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingRight: 16,
        height: 50,
        paddingLeft: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    createRoomText: {
        fontSize: 16,
        color: "blue",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        paddingLeft: 20,
    },
    userRoomCard: {
        width: 310, // Increase the width of the room card
        height: 210, // Increase the height of the room card
        borderRadius: 8,
        marginHorizontal: 12, // Add some margin to avoid cramped appearance
        overflow: "hidden",
    },
    imageBackground: {
        flex: 1,
        justifyContent: "flex-end",
        borderRadius: 8,
    },
    overlay: {
        flex: 1,

        justifyContent: "space-between",
        padding: 12,
    },
    liveText: {
        fontSize: 14, // Increase font size for better visibility
        color: "red",
        marginBottom: 6,
        
    },
    cardBody: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 12,
        left: 16,
        right: 16,
    },
    cardTitle: {
        fontSize: 18, // Increase font size for better visibility
        fontWeight: "bold",
        color: "white",
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    userCount: {
        fontSize: 16, // Increase font size for better visibility
        color: "white",
        marginLeft: 4,
    },
    roomList: {
        paddingHorizontal: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 16,
    },
    emptyContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "gray",
    },
});

export default UserRoomCard;