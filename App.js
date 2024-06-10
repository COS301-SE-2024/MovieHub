import "regenerator-runtime/runtime";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfilePage from "./frontend/src/Screens/ProfilePage";
import EditProfile from "./frontend/src/Screens/EditProfile";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomDrawer from "./frontend/src/Screens/ProfileDrawer";
import HomePage from "./frontend/src/Screens/HomePage";
import MainHeader from "./frontend/src/Components/MainHeader";
import LoginPage from "./frontend/src/Screens/LoginPage";
import SignupPage from "./frontend/src/Screens/SignupPage";
import LandingPage from "./frontend/src/Screens/LandingPage";
import HelpCentre from "./frontend/src/Screens/HelpCentre";
import FAQs from "./frontend/src/Screens/FAQs";

const Nav = createNativeStackNavigator();

export default function App() {
    const [navigationState, setNavigationState] = useState(null);

    return (
        <NavigationContainer>
            <Nav.Navigator
                initialRouteName="LandingPage"
                screenOptions={({ navigation }) => {
                    if (!navigationState) {
                        setNavigationState(navigation);
                    }
                    return {};
                }}>
                <Nav.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
                <Nav.Screen name="SignupPage" component={SignupPage} options={{ headerShown: false }} />
                <Nav.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
                <Nav.Screen name="HomePage" component={HomePage} options={{ header: () => <MainHeader/> }} />
                <Nav.Screen
                    name="ProfilePage"
                    component={ProfilePage}
                    options={({ navigation }) => ({
                        title: "",
                        headerShadowVisible: false,
                        headerRight: () => (
                            <View style={{ marginRight: 10 }}>
                                {/* Your menu icon component */}
                                <Text onPress={() => navigation.navigate("CustomDrawer")}>
                                    <Icon name="menu" size={24} />
                                </Text>
                            </View>
                        ),
                    })}
                />
                <Nav.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={({ navigation }) => ({
                        title: "Edit Profile",
                        headerStyle: {
                            backgroundColor: "#fff",
                        },
                        headerTintColor: "#000",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                        headerRight: () => (
                            <View style={{ marginRight: 10 }}>
                                {/* Your menu icon component */}
                                <Text onPress={() => navigation.navigate("CustomDrawer")}>
                                    <Icon name="menu" size={24} />
                                </Text>
                            </View>
                        ),
                    })}
                />
                <Nav.Screen name="HelpCentre" component={HelpCentre} />
                <Nav.Screen name="FAQs" component={FAQs} />
                <Nav.Screen name="CustomDrawer" component={CustomDrawer} options={{ title: "Settings and Activity" }} />
            </Nav.Navigator>
        </NavigationContainer>
    );
}
