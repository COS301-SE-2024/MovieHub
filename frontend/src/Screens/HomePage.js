import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView,RefreshControl} from 'react-native';
import MovieCard from "../Components/MovieCard"
import movie1 from "../../../assets/moonlight.jpg"
import movie2 from '../../../assets/Assassin_movie.jpg'
import movie3 from '../../../assets/topgun_movie.jpg'
import movie4 from '../../../assets/us_movie.jpg'
import movie5 from '../../../assets/oppenheimer_movie.jpg'
import TrendingMovie from "../Components/TrendingMovies"
import movie6 from "../../../assets/django.jpg"
import movie7 from '../../../assets/alla.jpg'
import movie8 from '../../../assets/looper.jpg'
import movie9 from '../../../assets/joker.jpg'
import movie10 from '../../../assets/phobia.jpg'
import movie11 from "../../../assets/free guy.jpg"
import movie12 from '../../../assets/brides maid.jpg'
import movie13 from '../../../assets/centa;.jpg'
import movie14 from '../../../assets/brothers.jpg'
import movie15 from '../../../assets/friday.jpg'
import BottomHeader from "../Components/BottomHeader"
import { useNavigation } from "@react-navigation/native";
import {getPopularMovies} from '../Services/TMDBApiService';

const HomePage = () => {

    let [movies, setMovies] = useState([]);
    let [movieTitle, setmovieTitle] = useState([]);
    let [moviePosterPath, setmoviePosterPath] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
        const fetchMovies = async () => {
          try {
            const fetchedMovies = await getPopularMovies();
            setMovies(fetchedMovies);
          } catch (error) {
            console.error('Error fetching movies:', error);
          }
          finally {
            console.log("fetchmovies",movies);
          }
        };

        const handleRefresh = () =>{
            setRefreshing(true)
            fetchMovies()
            setRefreshing(false)
          }
    

        useEffect(() => {
        fetchMovies();
        }, []);


        // movies.forEach((movie) => {
        //     setmovieTitle(movie.title);
        //     setmoviePosterPath(movie.poster_path);
          

        //   });

    return (
        <View style={{flex:1}}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}>
 
            <View style={styles.wholecontainer}>

            <View style={styles.container}>
                <Text style={styles.trending}>Just for you</Text>
                <ScrollView horizontal>
                    <MovieCard
                    imageUrl={movie1}
                    title="Moonlight"
                    />
                    <MovieCard
                    imageUrl={movie2}
                    title="Assassin"
                    />
                    <MovieCard
                    imageUrl={movie3}
                    title="Top Gun Maverick"
                    />
                    <MovieCard
                    imageUrl={movie4}
                    title="US"
                    />
                    <MovieCard
                    imageUrl={movie5}
                    title="Oppenheimer"
                    />
             </ScrollView>
         </View>   

            <View style={styles.viewall}>
             <Text style={styles.trending}>Trending Movies</Text>
             <Text style={styles.viewalltext}>View all</Text>
            </View>

            <ScrollView horizontal>
                    <TrendingMovie
                    imageUrl={movie6}
                    />
                    <TrendingMovie
                    imageUrl={movie7}
                    />
                    <TrendingMovie
                    imageUrl={movie8}
                    />
                    <TrendingMovie
                    imageUrl={movie9}
                    />
                    <TrendingMovie
                    imageUrl={movie10}
                    />

            </ScrollView>

            <View style={styles.viewall}>
             <Text style={styles.trending}>Comedy</Text>
             <Text style={styles.viewalltext}>View all</Text>
            </View>

            <ScrollView horizontal>
                    <TrendingMovie
                    imageUrl={movie11}
                    />
                    <TrendingMovie
                    imageUrl={movie12}
                    />
                    <TrendingMovie
                    imageUrl={movie13}
                    />
                    <TrendingMovie
                    imageUrl={movie14}
                    />
                    <TrendingMovie
                    imageUrl={movie15}
                    />

            </ScrollView>

            <View style={styles.viewall}>
             <Text style={styles.trending}>Comedy</Text>
             <Text style={styles.viewalltext}>View all</Text>
            </View>

            <ScrollView horizontal>
                    <TrendingMovie
                    imageUrl={movie11}
                    />
                    <TrendingMovie
                    imageUrl={movie12}
                    />
                    <TrendingMovie
                    imageUrl={movie13}
                    />
                    <TrendingMovie
                    imageUrl={movie14}
                    />
                    <TrendingMovie
                    imageUrl={movie15}
                    />

            </ScrollView>

            <View style={styles.viewall}>
             <Text style={styles.trending}>Trending Movies</Text>
             <Text style={styles.viewalltext}>View all</Text>
            </View>

            <ScrollView horizontal>
                    <TrendingMovie
                    imageUrl={movie6}
                    />
                    <TrendingMovie
                    imageUrl={movie7}
                    />
                    <TrendingMovie
                    imageUrl={movie8}
                    />
                    <TrendingMovie
                    imageUrl={movie9}
                    />
                    <TrendingMovie
                    imageUrl={movie10}
                    />

            </ScrollView>

            </View>
            
        </ScrollView>

        <BottomHeader/>

    </View>
    );
};

const styles = StyleSheet.create({
    wholecontainer: {
        backgroundColor: '#fff'

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fffff'
    },
    justforyou: {
        paddingTop: 3,
        textAlign: 'center',
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',

    },

    trending :{
        paddingLeft:10,
        paddingTop: 20,
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },

    viewall: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
        backgroundColor: '#fffff',
    },

    viewalltext: {
        paddingTop: 25,
        fontFamily: 'Roboto',
    }



        
});

export default HomePage;