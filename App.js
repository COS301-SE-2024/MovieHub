import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileHeader from "./frontend/src/Components/ProfileHeader";
import ProfilePage from "./frontend/src/Screens/ProfilePage";
import { EditProfile } from "./frontend/src/Screens/EditProfile";
import Icon from "react-native-vector-icons/MaterialIcons";

const Nav = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Nav.Navigator initialRouteName="ProfilePage">
                <Nav.Screen name="ProfilePage" component={ProfilePage} options={{ header: () => <ProfileHeader /> }} />
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
                                <Text onPress={() => navigation.navigate("Menu")}>
                                    <Icon name="menu" size={30} />
                                </Text>
                            </View>
                        ),
                    })}
                />
            </Nav.Navigator>
        </NavigationContainer>
    );
}
