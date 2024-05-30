import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./frontend/src/Screens/HomePage";
import SignupPage from "./frontend/src/Screens/SignupPage";
import MainHeader from "./frontend/src/Components/MainHeader";
import BottomHeader from "./frontend/src/Components/BottomHeader"


const Nav = createNativeStackNavigator();

export default function App() {
  return (

    <NavigationContainer>
      <Nav.Navigator initialRouteName="SignupPage">
        <Nav.Screen
          name="SignupPage"
          component={SignupPage}
        />
      </Nav.Navigator>
    </NavigationContainer>

  );
}

