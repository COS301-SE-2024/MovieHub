require('regenerator-runtime/runtime');
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfilePage from "./frontend/src/Screens/ProfilePage";
import EditProfile from "./frontend/src/Screens/EditProfile";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomDrawer from "./frontend/src/Components/ProfileDrawer";
import HomePage from "./frontend/src/Screens/HomePage";
import MainHeader from "./frontend/src/Components/MainHeader";
import SearchHeader from "./frontend/src/Components/SearchHeader";
import ProfileHeader from "./frontend/src/Components/ProfileHeader";
import LoginPage from "./frontend/src/Screens/LoginPage";
import SignupPage from "./frontend/src/Screens/SignupPage";
import LandingPage from "./frontend/src/Screens/LandingPage";
import SearchPage from "./frontend/src/Screens/SearchPage";

const Nav = createNativeStackNavigator();

export default function App() {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [navigationState, setNavigationState] = useState(null);

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };
    return (
        <NavigationContainer>
            <Nav.Navigator initialRouteName="LandingPage"
                screenOptions={({ navigation }) => {
                    if (!navigationState) {
                        setNavigationState(navigation);
                    }

                    return {};
                }}>
                {/* <Nav.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
                <Nav.Screen name="SignupPage" component={SignupPage} options={{ headerShown: false }} />
                <Nav.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} /> */}
                <Nav.Screen name="HomePage" component={HomePage} options={{ header: () => <MainHeader/> }} />
                
                <Nav.Screen
                    name="ProfilePage"
                    component={ProfilePage}
                    options={({ navigation }) => ({
                        title: "",
                        headerShadowVisible: false,
                        headerBackTitleVisible: false,
                        headerRight: () => (
                            <View style={{ marginRight: 10 }}>
                                {/* Your menu icon component */}
                                <Text onPress={toggleDrawer}>
                                    <Icon name="menu" size={24} />
                                </Text>
                            </View>
                        ),
                        headerTintColor: 'black',
                    })}
                />

                <Nav.Screen 
                    name="SearchPage" 
                    component={SearchPage} 
                    options={({ navigation }) => ({
                        title: "",
                        headerShadowVisible: false,
                        headerBackTitleVisible: false,
                        headerTintColor: 'black',
                    })}
                />
            </Nav.Navigator>
            {drawerVisible && <CustomDrawer navigation={navigationState} closeDrawer={closeDrawer} />}
        </NavigationContainer>
    );
}
