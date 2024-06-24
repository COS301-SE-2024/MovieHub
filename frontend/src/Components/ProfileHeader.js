import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileHeader({ toggleDrawer }) {
    return (
        <View style={styles.profileHeader}>
            <Icon name='arrow-back' size={24}></Icon>
            <View>
                <Icon name='menu'size={24} onPress={toggleDrawer}></Icon>
            </View>
        </View> 
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        height: 70,
        paddingTop: 38,
        marginBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

// export default ProfileHeader;
