import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const watchlists = [
  { id: '1', name: 'To Be Watched', privacy: 'Private', movies: 5, image:require('../Components/movie2.jpg') },
  { id: '2', name: 'Peak Fiction', privacy: 'Private', movies: 2, image: require('../Components/movie1.jpg')},
  { id: '3', name: 'Love to hate', privacy: 'Public', movies: 3, image: require('../Components/movie3.jpeg') },
];

const WatchlistTab = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);

  const openOptionsMenu = (watchlist) => {
    setSelectedWatchlist(watchlist);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedWatchlist(null);
  };

  const renderWatchlistItem = ({ item }) => (
    <View style={styles.watchlistItem}>
      <Image source={item.image} style={styles.watchlistImage} />
      <View style={styles.watchlistInfo}>
        <Text style={styles.watchlistName}>{item.name}</Text>
        <Text style={styles.watchlistPrivacy}>{item.privacy}</Text>
        <Text style={styles.watchlistMovies}>{item.movies} movies</Text>
      </View>
      <TouchableOpacity style={styles.moreButton} onPress={() => openOptionsMenu(item)}>
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create new watchlist</Text>
        <MaterialIcons name="add" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        data={watchlists}
        renderItem={renderWatchlistItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your watchlist is currently empty. Browse movies and add the ones you want to watch here!</Text>
          </View>
        }
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalOption} onPress={() => {
              // Handle Edit action
              closeModal();
              console.log(`Edit ${selectedWatchlist.name}`);
            }}>
              <MaterialIcons name="edit" size={24} color="black" />
              <Text style={styles.modalOptionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => {
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
    padding: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    fontSize: 18,
    marginLeft: 110,
  },
  watchlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  watchlistImage: {
    width: 182,
    height: 170,
    borderRadius: 8,
    marginRight: 16,
  },
  watchlistInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  watchlistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  watchlistPrivacy: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold'
  },
  watchlistMovies: {
    fontSize: 14,
    color: '#666',
  },
  moreButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: 200,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalOptionText: {
    fontSize: 18,
    marginLeft: 8,
  },
});

export default WatchlistTab;
