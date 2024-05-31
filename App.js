import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./frontend/src/Screens/HomePage";
import MainHeader from "./frontend/src/Components/MainHeader";
import BottomHeader from "./frontend/src/Components/BottomHeader"
import SignupPage from "./frontend/src/Screens/SignupPage"
import LoginPage from './frontend/src/Screens/LoginPage';


const Nav = createNativeStackNavigator();

export default function App() {
  return (

    <NavigationContainer>
      <Nav.Navigator initialRouteName="SignupPage">
        <Nav.Screen
          name="SignupPage"
          component={SignupPage}
          options={{ headerShown: false }}
        />
        <Nav.Screen
          name="HomePage"
          component={HomePage}
          options={{ header: () => <MainHeader /> }}
        />
         <Nav.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
      </Nav.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>

  );
}

