import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { getUserPublicWatchlists } from "../Services/UsersApiService";
import { deleteWatchlist } from "../Services/ListApiService"; // Import the deleteWatchlist function
import { useTheme } from "../styles/ThemeContext";

const WatchlistTab = ({ userInfo }) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWatchlist, setSelectedWatchlist] = useState(null);
    const [watchlists, setWatchlists] = useState([]);
    const navigation = useNavigation();

    console.log("followers watchlist", userInfo);
    // Fetch user watchlists
    useEffect(() => {
        const fetchUserWatchlists = async () => {
            try {
                console.log("This is the user Info being passed in Watchlist.js : " + JSON.stringify(userInfo));
                const userId = userInfo.uid; // Replace with actual user ID fetching logic

                const userWatchlists = await getUserPublicWatchlists(userId);
                const watchlistId = userWatchlists.id;
                console.log(userWatchlists);
                setWatchlists(userWatchlists);
            } catch (error) {
                console.error('Error fetching user watchlists:', error);
                // Handle error or fallback to empty array
                setWatchlists([]);
            }
        };

        fetchUserWatchlists();
    }, []);

    const openOptionsMenu = (watchlist) => {
        setSelectedWatchlist(watchlist);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedWatchlist(null);
    };

    const goToWatchlistDetails = (watchlist) => {
        console.log('About to navigate. \n Here is the watch list info: ', watchlist);
        navigation.navigate('WatchlistDetails', { watchlist });
    };

    const handleDeleteWatchlist = async () => {
        try {
            await deleteWatchlist(selectedWatchlist.id);
            setWatchlists(watchlists.filter(w => w.id !== selectedWatchlist.id)); // Update state to remove deleted watchlist
            closeModal();
            Alert.alert('Success', 'Watchlist deleted successfully!');
        } catch (error) {
            console.error('Error deleting watchlist:', error);
            Alert.alert('Error', 'Failed to delete watchlist. Please try again later.');
        }
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
            color: theme.gray,
            fontWeight: "bold",
        },
        watchlistItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
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
            margin: 5
        },
        watchlistName: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.textColor,
        },
        watchlistPrivacy: {
            fontSize: 14,
            color: theme.gray,
            fontWeight: "bold",
        },
        watchlistMovies: {
            fontSize: 14,
            color: theme.gray,
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
            paddingTop: 25,
            fontSize: 16,
            color: theme.gray,
            textAlign: "center",
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
        },
        modalContainer: {
            backgroundColor: theme.backgroundColor,
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

    return (
        <View style={styles.container}>
            <ScrollView>
                {watchlists.map((watchlist) => (
                    <TouchableOpacity key={watchlist.id} style={styles.watchlistItem} onPress={() => goToWatchlistDetails(watchlist)}>
                        <Image source={{ uri: watchlist.img ? watchlist.img : 'https://picsum.photos/seed/picsum/20/300' }} style={styles.watchlistImage} />
                        <View style={styles.watchlistInfo}>
                            <Text style={styles.watchlistName}>{watchlist.name}</Text>
                            <Text style={styles.watchlistPrivacy}>
                                {watchlist.visibility ? 'Private' : 'Public'}
                            </Text>
                            <Text style={styles.watchlistMovies}>{watchlist.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                {watchlists.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No watchlist yet</Text>
                    </View>
                )}
            </ScrollView>
            <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
                <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                navigation.navigate('EditWatchlist', { userInfo });
                                closeModal();
                                console.log(`Edit ${selectedWatchlist.name}`);
                            }}>
                            <MaterialIcons name="edit" size={24} color={theme.iconCOlor} />
                            <Text style={styles.modalOptionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                handleDeleteWatchlist();
                            }}>
                            <MaterialIcons name="delete" size={24} color={theme.iconCOlor} />
                            <Text style={styles.modalOptionText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};



export default WatchlistTab;
