import React , {useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import image1 from "../../../assets/Assassin_movie.jpg";
import image2 from "../../../assets/oppenheimer_movie.jpg";
import image3 from "../../../assets/moonlight.jpg";

export default function MovieCard({movieId, imageUrl, title, rating, overview, date}) {

    const navigation = useNavigation();

    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", {movieId : movieId,imageUrl: imageUrl, title: title, rating: rating, overview: overview, date: date});
    };


    const [liked, setLiked] = useState(false);

    const handleLikePress = () => {
        setLiked(!liked);
    };

    return (
        <View style={styles.container}>
            
        <TouchableOpacity onPress={handleNewUser} activeOpacity={1} style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            
            {/* <Text style={styles.title}>{title}</Text> */}
                
        </TouchableOpacity>
    </View>
    );
}
 
const styles = StyleSheet.create({

    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 400,
        height: 500,
        paddingRight: 15,
        paddingLeft: 15,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,


    },
    card: {
        position: 'relative',
        width: '79%',
        backgroundColor: 'transparent',
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
        height: '100%',
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