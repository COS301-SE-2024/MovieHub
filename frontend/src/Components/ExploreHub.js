import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export default function ExploreHub() {

    const squaresData = [
        { id: 1, text: 'Live - Marley & Me', roomName: 'feel like ranting?', peopleCount: 337 },
        { id: 2, text: 'Live - Only you', roomName: 'Room 2', peopleCount: 8 },
        { id: 3, text: 'Live - Spectre', roomName: 'Room 3', peopleCount: 12 },
        { id: 4, text: 'Live - Transformers', roomName: 'Room 4', peopleCount: 20 },
    ];

    const navigation = useNavigation();

    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", {movieId,imageUrl,title, rating, overview, date});
    };

    return (
        <View style={styles.container}>
            {squaresData.map(square => (
                <TouchableOpacity key={square.id} onPress={() => handleNewUser(square)} style={styles.square}>
                    <View style={styles.topContent}>
                        <View style={styles.words}>
                            <View style={styles.liveDot} />
                            <Text style={styles.text}>{square.text}</Text>
                        </View>
                    </View>
                    <View style={styles.bottomContent}>
                        <Text style={styles.roomName}>{square.roomName}</Text>
                        <View style={styles.peopleCountContainer}>
                            <Ionicons name="people-sharp" size={24} color="black" />
                            <Text style={styles.peopleCount}>{square.peopleCount}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffffff',
        paddingBottom: 10,

    },  square: {
        width: 250,
        height: 180,
        margin: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 4,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        padding: 10,
    },
    liveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        marginRight: 5,
        marginLeft: 10,
    },
    words:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomName: {
        fontSize: 15,
        color: '#000',
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    peopleCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    peopleCount: {
        fontSize: 14,
        color: 'black',
        marginLeft: 5,
        fontWeight: 'bold',
       
    },
    bottomContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        paddingTop: 100,
    },

});