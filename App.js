import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./frontend/src/Screens/HomePage";
import MainHeader from "./frontend/src/Components/MainHeader";


const Nav = createNativeStackNavigator();

export default function App() {
  return (

    <NavigationContainer>
      <Nav.Navigator initialRouteName="HomePage">
        <Nav.Screen
          name="HomePage"
          component={HomePage}
          options={{ header: () => <MainHeader /> }}
        />
      </Nav.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>

  );
}

