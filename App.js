import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./frontend/src/Screens/HomePage";
import LoginPage from "./frontend/src/Screens/LoginPage";
import MainHeader from "./frontend/src/Components/MainHeader";
import BottomHeader from "./frontend/src/Components/BottomHeader"


const Nav = createNativeStackNavigator();

export default function App() {
  return (

    <NavigationContainer>
      <Nav.Navigator initialRouteName="Login">
        <Nav.Screen
          name="Login"
          component={LoginPage}
          // options={{ header: () => <MainHeader /> }}
        />
      </Nav.Navigator>
      <BottomHeader/>
      <StatusBar style="auto" />
    </NavigationContainer>

  );
}

