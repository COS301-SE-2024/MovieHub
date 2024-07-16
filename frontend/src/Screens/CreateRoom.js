import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWebSocket } from '../context/WebSocketProvider';

const CreateRoom = ({ route }) => {
    const { userInfo } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [accessLevel, setAccessLevel] = useState('everyone');
    const [joinRoomName, setJoinRoomName] = useState('');
    const [existingRooms, setExistingRooms] = useState([]);
    const navigation = useNavigation();
    const socket = useWebSocket();
    const messageListenerRef = useRef(null);

    const createRoom = () => {
        if (!roomName) {
            Alert.alert("Room Name Required", "Please enter a name for the room.");
            return;
        }

        const newRoom = {
            roomName,
            accessLevel,
        };

        // Send room creation through WebSocket
        socket.send(JSON.stringify({
            type: 'create_room',
            userInfo: {
                id: userInfo.userId,
                username: userInfo.username,
            },
            roomName: newRoom.roomName,
            accessLevel: newRoom.accessLevel,
        }));

        setModalVisible(false);
        setRoomName('');
        setAccessLevel('everyone');

        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.type === 'room_created') {
                navigation.navigate('WatchParty', { userInfo, roomDetails: response.roomDetails });
            }
        };
    };

    const joinRoom = (room) => {
        navigation.navigate('WatchParty', { userInfo, roomName: room.roomName });
    };

    useEffect(() => {
        const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "existing_rooms") {
                setExistingRooms(data.rooms);
            } else if (data.type === 'room_created') {
                navigation.navigate('WatchParty', { userInfo, roomDetails: data.roomDetails });
            }
        };

        if (socket) {
            messageListenerRef.current = handleMessage;
            socket.addEventListener('message', messageListenerRef.current);
            
            // Request existing rooms
            socket.send(JSON.stringify({
                type: 'existing_rooms',
            }));
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (socket && messageListenerRef.current) {
                socket.removeEventListener('message', messageListenerRef.current);
            }
        };
    }, [socket]);

    const renderRoomItem = ({ item }) => (
        <TouchableOpacity onPress={() => joinRoom(item)} style={styles.roomItem}>
            <Text style={styles.roomName}>{item.roomName}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create or Join Room</Text>

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.createButtonText}>Create Room</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.joinButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.joinButtonText}>Join Room</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Existing Rooms</Text>
            <FlatList
                data={existingRooms}
                keyExtractor={(item) => item.roomId}
                renderItem={renderRoomItem}
                style={styles.roomList}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Room</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter room name"
                            value={roomName}
                            onChangeText={setRoomName}
                        />

                        <View style={styles.accessLevelContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.accessLevelButton,
                                    accessLevel === 'everyone' && styles.selectedButton,
                                ]}
                                onPress={() => setAccessLevel('everyone')}
                            >
                                <Text style={styles.accessLevelText}>Everyone</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.accessLevelButton,
                                    accessLevel === 'invite' && styles.selectedButton,
                                ]}
                                onPress={() => setAccessLevel('invite')}
                            >
                                <Text style={styles.accessLevelText}>Invite Only</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.accessLevelButton,
                                    accessLevel === 'followers' && styles.selectedButton,
                                ]}
                                onPress={() => setAccessLevel('followers')}
                            >
                                <Text style={styles.accessLevelText}>Followers</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={createRoom}
                            >
                                <Text style={styles.modalButtonText}>Create</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Join Room Section */}
                        <Text style={styles.modalTitle}>Join Room</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter room name to join"
                            value={joinRoomName}
                            onChangeText={setJoinRoomName}
                        />

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={joinRoom}
                        >
                            <Text style={styles.modalButtonText}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    createButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    joinButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    accessLevelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    accessLevelButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    selectedButton: {
        backgroundColor: 'blue',
    },
    accessLevelText: {
        color: '#000',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        margin: 5,
        backgroundColor: 'blue',
    },
    modalButtonText: {
        color: '#fff',
    },
    roomList: {
        marginTop: 8,
    },
    roomItem: {
        padding: 16,
        backgroundColor: '#f1f1f1',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    roomName: {
        fontSize: 18,
    },
});

export default CreateRoom;
