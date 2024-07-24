import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import BottomHeader from '../Components/BottomHeader';
import NonFollowerPost from '../Components/NonFollowerPost';
import CategoriesFilters from '../Components/CategoriesFilters';
import ExploreHub from '../Components/ExploreHub';
import { Ionicons } from '@expo/vector-icons';


export default function ExplorePage({route}) {

  const { userInfo } = route.params;

    const navigation = useNavigation();

    const [selectedCategory, setSelectedCategory] = React.useState('');

    const handleNewUser = () => {
        navigation.navigate("MovieDescriptionPage", {movieId,imageUrl,title, rating, overview, date});
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <CategoriesFilters categoryName="Top Reviews" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Latests Posts" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Action" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Comedy" selectedCategory={selectedCategory} />
                    <CategoriesFilters categoryName="Drama" selectedCategory={selectedCategory} />
                </ScrollView>

                    <View style={styles.header}>
                        <Text style={styles.heading}>The Hub</Text>
                        <Ionicons name="chevron-forward" size={24} color="black" style={{ marginLeft: "auto" }} />
                    </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                    <ExploreHub/>
                    <ExploreHub/>
                    <ExploreHub/>
                    <ExploreHub/>

                </ScrollView>
                <View style={styles.postsContainer}>
                    <NonFollowerPost userInfo={userInfo} />
                    <NonFollowerPost />
                    <NonFollowerPost />
                    <NonFollowerPost />
                    <NonFollowerPost />
                    <NonFollowerPost />
                </View>
                
            </ScrollView>
            <BottomHeader userInfo={userInfo} />
        </View>
    );
}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#ffffff',
        // paddingBottom:10,

    },
    heading: {
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 23,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 1,
    },
    header: { 
        flexDirection: 'row',
        paddingTop: 15,
        padding: 10,
    },

});