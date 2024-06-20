import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function SearchHeader() {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name='arrow-back' size={30} />
            </TouchableOpacity>
            {/* <Text style={styles.title}>Search</Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 90,
        paddingTop: 38,
        backgroundColor: '#fff',
        flexDirection: 'row',
        // alignItems: 'center',
        paddingHorizontal: 10,
    },
    backButton: {
        paddingRight: 10,
        // paddingLeft: 10,
        paddingTop: 20,
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 24,
        paddingRight: 15,
    },
});
