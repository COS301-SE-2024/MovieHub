import React, { useState } from 'react';
import { StyleSheet, Button, Pressable, Text, View, ScrollView, Image, Dimensions } from 'react-native';
import landing1 from "../../../assets/landing1.png";
import landing2 from "../../../assets/landing2.png";
import landing3 from "../../../assets/landing3.png";
import landing4 from "../../../assets/landing4.png";
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
        backgroundColor: '#888888'
    },
    bubbleActive: {
        height: 10,
        width: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#000000'
    },
    subTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        width: 350
    },
    imgContainer: {
        width,
        height: 200,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
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
        margin:50,
        padding:10,
        width: '70%',
        height: 200,
        resizeMode: 'contain',
    },
    create: {
        margin: 10,
        width: '70%',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#000000',
        backgroundColor: '#000000',
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
