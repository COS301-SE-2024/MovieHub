import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const Rooms = () => {
    const navigation = useNavigation();
    const sections = [
        {
            movieTitle: "People You Follow",
            data: [
                { roomName: "Feel Like Ranting?", users: 372, movieTitle: "Marley & Me", live: true },
                { movieTitle: "My Little Pony", roomName: "Another Room", users: 128 },
                { roomName: "JSON's Room", users: 56 },
                { roomName: "Tech Talk", users: 200, live: true, movieTitle: "Shrek 3" },
                { movieTitle: "The Matrix", roomName: "Sci-Fi Lovers", users: 450 },
                { roomName: "Gaming Hub", users: 300 },
                { roomName: "Cooking Secrets", users: 180 },
            ],
        },
    ];

    return (
        <View style={styles.container}>
            {sections.map((section, index) => (
                <View key={index} style={styles.section}>
                    <FlatList 
                        data={section.data} 
                        renderItem={({ item }) => <Card {...item} handlePress={() => navigation.navigate("ViewRoom", { isUserRoom: false })}/>} 
                        keyExtractor={(item, index) => index.toString()} 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle={styles.cardColumn} 
                    />
                </View>
            ))}
        </View>
    );
};

const Card = ({ movieTitle, roomName, users, live, handlePress }) => (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
        {live && (
            <Text style={styles.liveText}>
                ● Live - <Text>{movieTitle}</Text>
            </Text>
        )}
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{roomName}</Text>
            <View style={styles.cardFooter}>
                <Icon name="users" size={16} />
                <Text style={styles.userCount}>{users}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    section: {
        marginVertical: 10,
    },
    cardColumn: {
        paddingBottom: 20,
    },
    card: {
        position: "relative",
        width: 300,
        height: 200,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16, // Add spacing between cards
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
    liveText: {
        color: "red",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    userCount: {
        marginLeft: 8,
    },
});

export default Rooms;