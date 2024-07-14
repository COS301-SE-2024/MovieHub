import React , {useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import CirclesWatch from "./CirclesWatch";
import image1 from "../../../assets/Assassin_movie.jpg";
import image2 from "../../../assets/oppenheimer_movie.jpg";
import image3 from "../../../assets/moonlight.jpg";

export default function MovieCard({movieId, imageUrl,title, rating, overview, date}) {

    const navigation = useNavigation();

    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", {movieId : movieId,imageUrl: imageUrl, title: title, rating: rating, overview: overview, date: date});
    };

    const [overlayVisible, setOverlayVisible] = useState(false);

    const [circlesVisible, setCirclesVisible] = useState(true);

    const handlePress = () => {
        setCirclesVisible(!circlesVisible);
        setOverlayVisible(!overlayVisible);
    };

    const [liked, setLiked] = useState(false);

    const handleLikePress = () => {
        setLiked(!liked);
    };

    const circlesData = [
        { imageUri: image3 },
        { imageUri: image2},
        { imageUri: image1 },
        { imageUri: image3 },
        { imageUri: image3 },
        { imageUri: image2},
        { imageUri: image1 },
        { imageUri: image3 },
        { imageUri: image3 },
    ];

    return (
        <View style={styles.container}>
            
        <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            
            <Text style={styles.title}>{title}</Text>
            {/* <CirclesWatch circles={circlesData} visible={circlesVisible} /> */}
            {overlayVisible && (
                    <View style={styles.overlay}>
                        <TouchableOpacity onPress={() => { /* Handle icon press */ }}>
                            <Ionicons name="eye-sharp" size={24} color="white"  marginLeft="6" style={styles.iconFirst}/>    
                            <Text style={styles.text}>Watch</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLikePress} style={styles.iconContainer}>
                            <Ionicons name="heart" size={24} color={liked ? 'red' : 'white'} style={styles.icon} />
                            <Text style={styles.text}>Like</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNewUser}>
                            <Octicons name="info" size={24} color="white" style={styles.icon}/>    
                            <Text style={styles.text}>Info</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
        </TouchableOpacity>
    </View>
    );
}
 
const styles = StyleSheet.create({

    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 500,
        paddingRight: 15,
        paddingLeft: 15,


    },
    card: {
        position: 'relative',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        height: 400,
        shadowOffset: {
        width: 0,
        height: 3,
        },

        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        paddingTop: 19,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', 
      },
      icon: {
        marginLeft: 5,
        fontSize: 20,
        paddingTop: 20,
        
    },
    text: {
        fontSize: 16,
        color: 'white', 
        paddingTop: 5,
    },
    iconFirst: {
        marginLeft: 12,
        fontSize: 20,
        paddingTop: 20,
        
    },
    

});