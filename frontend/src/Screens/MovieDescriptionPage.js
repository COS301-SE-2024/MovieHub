import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import Cast from "../Components/Cast";
import { getMovieCredits } from '../Services/TMDBApiService';


const MovieDescriptionPage = () =>
    {
        
        const route = useRoute();
        const {movieId, imageUrl, title, rating, overview, date } = route.params;

        const [credits, setCredits] = useState({ cast: [], crew: [] });

        useEffect(() => {
            const fetchCredits = async () => {
                const data = await getMovieCredits(movieId);
                setCredits(data);
            };
    
            fetchCredits();
        }, [movieId]);

        const director = credits.crew.find(person => person.job === 'Director');
    const cast = credits.cast.slice(0, 5).map(person => person.name).join(', ');

        return(
            <ScrollView style={styles.container}>
                <View style={styles.wholecontainer} >
                    <View style={styles.card}>
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    </View>
                </View>
                <View style={styles.moviedes}>
                    <View style={styles.movieinfo}>
                        <Text style={styles.movietitle} >{title}</Text>
                        <Text style={styles.movietitle}>{rating}/10</Text>
                    </View>
                    <View style={styles.movieinfo2}>
                        <Text style={styles.movietitle2} >{date} </Text>
                        <Text style={styles.movietitle2} > | </Text>
                        <Text style={styles.movietitle2} > 2h </Text>
                    </View>
                    <View style={styles.moviebio}>
                        <Text style={styles.moviebiotext}>{overview}</Text></View>
                    <View>
                        <Text style={styles.moviebio}>Starring: {cast}</Text>
                        <Text style={styles.moviebio}>Directed by: {cast}</Text>
                    </View>
                    <Text style={styles.moviecast} > Cast</Text>

                    

                    <ScrollView horizontal>
                    {credits.cast.slice(0, 5).map((member, index) => (
                        <Cast
                            key={index}
                            imageUrl={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                            name={member.name}
                        />
                    ))}

                    </ScrollView>

                    </View>

                    

            </ScrollView>
        );
    };

    const styles = StyleSheet.create({
        container :{
            flex:1,
            backgroundColor: '#ffffff',

        },
        wholecontainer: {
            alignItems: 'center',
            paddingTop: 30,
        },
        card: {
            width: '75%',
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 10,
            shadowColor: '#000',
            height: 425,
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
            borderRadius: 5,
            marginBottom: 5,
        },
        movieinfo:{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,

        },
        movieinfo2:{
            flex: 1,
            flexDirection: 'row',
            paddingLeft: 10,
            
        },
        movietitle: {
            paddingTop: 20,
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        movietitle2: {
            paddingLeft: 10,
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        moviebio: {
            paddingTop: 20,
            paddingLeft: 20,
            
        },
        moviebiotext: {
            fontSize: 15,
            paddingRight:10,
            
        },
        cast:{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 170,
            height: 250,
            paddingRight: 15,
            paddingLeft: 15,
            backgroundColor: "#000"
    
        },
        moviecast: {
            paddingTop: 20,
            fontSize: 25,
            paddingLeft:20,
            fontWeight: 'bold',
        },






    });


    export default MovieDescriptionPage;