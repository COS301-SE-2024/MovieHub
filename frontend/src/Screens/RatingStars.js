import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, themeStyles } from '../styles/theme';

const RatingStars = ({ rating, setRating }) => {
    return (
        <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons 
                        name={rating >= star ? 'film' : 'film-outline'} 
                        size={45} 
                        color={rating >= star ? colors.primary : 'gray'} 
                        style={styles.icon} 
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
        alignSelf: "center"
    },
    icon: {
        marginTop: 20,
        marginHorizontal: 7,

    },
});

export default RatingStars;
