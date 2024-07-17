import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView,RefreshControl, TouchableOpacity} from 'react-native';
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
import {getPopularMovies, getMoviesByGenre } from '../Services/TMDBApiService';

const HomePage = ({route}) => {
   // const route = useRoute();
    //Use userInfo to personlise a users homepage
    const {userInfo} = route.params;

    let [movies, setMovies] = useState([]);
    let [thrillerMovies, setThrillerMovies] = useState([]);
    let [comedyMovies, setComedyMovies] = useState([]);
    let [romanceMovies, setRomanceMovies] = useState([]);
    let [refreshing, setRefreshing] = useState(false);
    
        const fetchMovies = async () => {
          try {
            const fetchedMovies = await getPopularMovies();
            setMovies(fetchedMovies);

            const fetchedThrillerMovies = await getMoviesByGenre(53);
            setThrillerMovies(fetchedThrillerMovies);

            const fetchedComedyMovies = await getMoviesByGenre(35);
            setComedyMovies(fetchedComedyMovies);

            const fetchedRomanceMovies = await getMoviesByGenre(10749);
            setRomanceMovies(fetchedRomanceMovies);

          } catch (error) {
            console.error('Error fetching movies:', error);
          }
          finally {
            // console.log("fetchmovies",thrillerMovies);
            // console.log('item.poster_path',movies)
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


        // movies.forEach(movie => {

        //     console.log("Title:", movie.title);
        //     console.log("Overview:", movie.overview);
        //     console.log("Poster URL:", `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
        //     console.log("Release Date:", movie.release_date);
        //     console.log("Vote Average:", movie.vote_average);
        //     console.log("---------------");
        // });


        // movies.forEach((movie) => {
        //     setmovieTitle(movie.title);
        //     setmoviePosterPath(movie.poster_path);
          

        //   });

        // console.log('item.poster_path',movies.poster_path)

    return (
        <View style={{flex:1, backgroundColor: '#ffff'}}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}>
 
            <View style={styles.wholecontainer}>

            <View style={styles.container}>
                <Text style={styles.trending}>Just for you</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                     {movies.slice(0, 10).map((movie, index) => (

                                <MovieCard
                                    key={index}
                                    movieId={movie.id}
                                    imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    title={movie.title}
                                    overview={movie.overview}
                                    rating={movie.vote_average.toFixed(1)}
                                    date={new Date(movie.release_date).getFullYear()}
                                />
                            ))}
                </ScrollView>
            </View>   

            <View style={styles.viewall}>
                <Text style={styles.trending}>Trending Movies</Text>
                <Text style={styles.viewalltext}>View all</Text>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movies.slice(10, 20).map((movie, index) => (

                            <TrendingMovie
                                key={index}
                                movieId={movie.id}
                                imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                title={movie.title}
                                overview={movie.overview}
                                rating={movie.vote_average.toFixed(1)}
                                date={new Date(movie.release_date).getFullYear()}
                            />
                        ))}

            </ScrollView>

            <View style={styles.viewall}>
             <Text style={styles.trending}>Thriller</Text>
             <Text style={styles.viewalltext}>View all</Text>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {thrillerMovies.slice(0, 20).map((movie, index) => (

                            <TrendingMovie
                                key={index}
                                movieId={movie.id}
                                imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                title={movie.title}
                                overview={movie.overview}
                                rating={movie.vote_average.toFixed(1)}
                                date={new Date(movie.release_date).getFullYear()}
                            />
                        ))}

            </ScrollView>

            <View style={styles.viewall}>
             <Text style={styles.trending}>Comedy</Text>
             <Text style={styles.viewalltext}>View all</Text>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {comedyMovies.slice(5, 24).map((movie, index) => (

                            <TrendingMovie
                                key={index}
                                movieId={movie.id}
                                imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                title={movie.title}
                                overview={movie.overview}
                                rating={movie.vote_average.toFixed(1)}
                                date={new Date(movie.release_date).getFullYear()}
                            />
                        ))}

            </ScrollView>

            <View style={styles.viewall}>
             <Text style={styles.trending}>Romance</Text>
             <Text style={styles.viewalltext}>View all</Text>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {romanceMovies.slice(0, 20).map((movie, index) => (

                            <TrendingMovie
                                key={index}
                                movieId={movie.id}
                                imageUrl={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                title={movie.title}
                                overview={movie.overview}
                                rating={movie.vote_average.toFixed(1)}
                                date={new Date(movie.release_date).getFullYear()}
                            />
                        ))}
            </ScrollView>

            </View>
            
        </ScrollView>
{/* Add users info for bottom header */}
            <BottomHeader userInfo={userInfo} />

    </View>
    );
};

const styles = StyleSheet.create({
    wholecontainer: {
        backgroundColor: '#ffff'

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
        paddingTop: 0,
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },

    viewall: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
        paddingTop: 10,
        backgroundColor: '#fffff',
    },

    viewalltext: {
        fontFamily: 'Roboto',
    }



        
});

export default HomePage;