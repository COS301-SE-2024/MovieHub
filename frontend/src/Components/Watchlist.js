// WatchlistTab.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native'; 

const watchlists = [
    { 
        id: "1", 
        name: "To Be Watched", 
        privacy: "Private", 
        movies: 5, 
        image: require("../../../assets/movie2.jpg"),
        moviesList: [
            { id: "1", title: "Planet of the Apes", image: require("../../../assets/movie1.jpg") },
            { id: "2", title: "A Quiet Place", image: require("../../../assets/movie2.jpg") },
            { id: "1", title: "Us", image: require("../../../assets/movie1.jpg") },
            { id: "2", title: "Scream", image: require("../../../assets/movie2.jpg") },
            { id: "1", title: "Emo", image: require("../../../assets/movie1.jpg")},
        ],
    },
    { 
        id: "2", 
        name: "Peak Fiction", 
        privacy: "Private", 
        movies: 2, 
        image: require("../../../assets/movie1.jpg"),
        moviesList: [
            { id: "3", title: "Titanic", image: require("../../../assets/movie3.jpeg") },
            { id: "4", title: "The Graet Jahy", image: require("../../../assets/movie1.jpg") },
        ],
    },
    { 
        id: "3", 
        name: "Love to hate", 
        privacy: "Public", 
        movies: 3, 
        image: require("../../../assets/movie3.jpeg"),
        moviesList: [
            { id: "5", title: "A Quiet Place", image: require("../../../assets/movie2.jpg") },
            { id: "6", title: "Titanic", image: require("../../../assets/movie3.jpeg") },
        ],
    },
];

const WatchlistTab = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWatchlist, setSelectedWatchlist] = useState(null);
    const navigation = useNavigation();  // Use the navigation hook

    const openOptionsMenu = (watchlist) => {
        setSelectedWatchlist(watchlist);
        setModalVisible(true);
    }; 

    const closeModal = () => {
        setModalVisible(false);
        setSelectedWatchlist(null);
    };

    const goToWatchlistDetails = (watchlist) => {
        navigation.navigate('WatchlistDetails', { watchlist });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateWatchlist')}  // Navigate to the CreateWatchlist screen
            >
                <Text style={styles.createButtonText}>Create new watchlist</Text>
                <View style={{flex :1}} />
                <MaterialIcons name="add" size={24} color="black" />
            </TouchableOpacity>
            <ScrollView>
                {watchlists.map((watchlist) => (
                    <TouchableOpacity key={watchlist.id} style={styles.watchlistItem} onPress={() => goToWatchlistDetails(watchlist)}>
                        <Image source={watchlist.image} style={styles.watchlistImage} />
                        <View style={styles.watchlistInfo}>
                            <Text style={styles.watchlistName}>{watchlist.name}</Text>
                            <Text style={styles.watchlistPrivacy}>{watchlist.privacy}</Text>
                            <Text style={styles.watchlistMovies}>{watchlist.movies} movies</Text>
                        </View>
                        <TouchableOpacity style={styles.moreButton} onPress={() => openOptionsMenu(watchlist)}>
                            <MaterialIcons name="more-vert" size={24} color="black" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
                <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                // Handle Edit action
                                navigation.navigate('EditWatchlist')
                                closeModal();
                                console.log(`Edit ${selectedWatchlist.name}`);
                            }}>
                            <MaterialIcons name="edit" size={24} color="black" />
                            <Text style={styles.modalOptionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                // Handle Delete action
                                closeModal();
                                console.log(`Delete ${selectedWatchlist.name}`);
                            }}>
                            <MaterialIcons name="delete" size={24} color="black" />
                            <Text style={styles.modalOptionText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    createButton: {
        flexDirection: "row",
        marginBottom: 10,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    createButtonText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "bold",
        
    },
    watchlistItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    watchlistImage: {
        width: 182,
        height: 180,
        borderRadius: 8,
        marginRight: 16,
        objectFit: "cover",
    },
    watchlistInfo: {
        flexDirection: "column",
        flex: 1,
        margin:5
    },
    watchlistName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    watchlistPrivacy: {
        fontSize: 14,
        color: "#666",
        fontWeight: "bold",
    },
    watchlistMovies: {
        fontSize: 14,
        color: "#666",
    },
    moreButton: {
        margin: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        width: 200,
    },
    modalOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    modalOptionText: {
        fontSize: 18,
        marginLeft: 8,
    },
});

export default WatchlistTab;
