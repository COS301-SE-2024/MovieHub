import React, { useState } from 'react';
import { StyleSheet, Button, Pressable, Text, View, ScrollView, Image, Dimensions, StatusBar } from 'react-native';
import landing1 from "../../../assets/film2.jpg";
import landing2 from "../../../assets/neon.jpg";
import landing3 from "../../../assets/vintagefilm.jpg";
import landing4 from "../../../assets/film.jpg";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const LandingPage = () => {
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollView}>
                <View style={styles.imgContainer}>
                    <Image source={landing1} style={styles.image}/>
                    <Text style={styles.subTitle}>Welcome to MovieHub</Text>
                    <Text style={styles.text}>Discover, review, and discuss your favourite films on the ultimate platform for movie enthusiasts.</Text>
                </View>
                <View style={styles.imgContainer}>
                    <Image source={landing2} style={styles.image}/>
                    <Text style={styles.subTitle}>Connect With Other Movie Lovers</Text>
                    <Text style={styles.text}>Follow friends, like reviews, and comment on discussions to build your own network.</Text>
                </View>
                <View style={styles.imgContainer}>
                    <Image source={landing3} style={styles.image}/>
                    <Text style={styles.subTitle}>Share Your Thoughts</Text>
                    <Text style={styles.text}>Write and submit reviews, and share your thoughts with a community of movie enthusiasts.</Text>
                </View>
                <View style={styles.imgContainer}>
                    <Image source={landing4} style={styles.image}/>
                    <Text style={styles.subTitle}>Get Personalised Recommendations</Text>
                    <Text style={styles.text}>Enjoy movie suggestions tailored to your unique tastes and viewing history.</Text>
                </View>
            </ScrollView>
            <View style={styles.scrollContainer}>
                <View style={activeIndex === 0 ? styles.bubbleActive : styles.bubble} />
                <View style={activeIndex === 1 ? styles.bubbleActive : styles.bubble} />
                <View style={activeIndex === 2 ? styles.bubbleActive : styles.bubble} />
                <View style={activeIndex === 3 ? styles.bubbleActive : styles.bubble} />
            </View>
            <Pressable style={styles.create} onPress={() => navigation.navigate('SignupPage')}>
                <Text style={styles.createText}>Create Account</Text>
            </Pressable>
            <Pressable style={styles.login} onPress={() => navigation.navigate('LoginPage')}>
                <Text style={styles.loginText}>Login</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        marginTop: 20
    },
    bubble: {
        height: 10,
        width: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#000000'
    },
    bubbleActive: {
        height: 10,
        width: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#4a42c0'
    },
    subTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color: 'white',
        position: 'absolute',
        top: 20,
        zIndex: 1,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        width: 350,
        color: 'white',
        position: 'absolute'
    },
    imgContainer: {
        width,
        height: 200,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        
    },
    scrollView: {
        flexDirection: 'row',
        // padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // height: '300%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 50
    },
    image: {
        // margin:50,
        // padding:10,
        width: '100%',
        height: '400%',
        resizeMode: 'cover',
    },
    create: {
        margin: 10,
        width: '70%',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#ffffff',
        backgroundColor: '#4a42c0',
        borderWidth: 1.5
    },
    createText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16
    },
    login: {
        margin: 10,
        width: '70%',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#000000',
        backgroundColor: '#ffffff',
        borderWidth: 1.5
    },
    loginText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 16
    }
});

export default LandingPage;
