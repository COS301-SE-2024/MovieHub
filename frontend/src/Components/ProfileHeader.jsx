import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileHeader() {
    return (
        <View style={styles.profileHeader}>
            <Icon name='arrow-back' size={24}></Icon>
            <View>
                <Icon name='menu'size={30}></Icon>
            </View>
        </View> 
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        height: 80,
        paddingTop: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

// export default ProfileHeader;
