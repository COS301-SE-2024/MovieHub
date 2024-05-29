import React, { useState } from 'react';
import { StyleSheet, Button, Text, TextInput, View, Image} from 'react-native';
import google from '../../../assets/google.png';
import facebook from '../../../assets/facebook.png';
import twitter from '../../../assets/twitter.png';

const SignupPage = () => {
    const [text, onChangeText] = React.useState('Useless Text');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
                style={styles.inputText}
                onChangeText={onChangeText}
                value=''
                placeholder='Userrname'
            />
            <TextInput
                style={styles.inputText}
                onChangeText={onChangeText}
                value=''
                placeholder='Email'
            />
            <TextInput
                style={styles.inputText}
                onChangeText={onChangeText}
                value=''
                placeholder='Password'
            />
            <TextInput
                style={styles.inputText}
                onChangeText={onChangeText}
                value=''
                placeholder='Confirm Password'
            />
            <Button
                title='Sign Up'
                color='#000000'
            />
            <View style={styles.socialContainer}>
                <Image style={styles.socialLink} source={google}/>
                <Image style={styles.socialLink} source={facebook}/>
                <Image style={styles.socialLink} source={twitter}/>
            </View>
            <Text style={styles}>Already have an account? Sign Up</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontFamily: 'Roboto',
        color: '#000000',
        fontSize: 25,
        fontWeight: 'bold',
    },
    inputText: {
        height: 30,
        width: 200,
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
        borderRadius: 5,
    },  
    socialContainer: {
        flexDirection: 'row'
    },

    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 70,
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

export default SignupPage;