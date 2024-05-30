import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileHeader from "./frontend/src/Components/ProfileHeader";
import ProfilePage from "./frontend/src/Screens/ProfilePage";
import { EditProfile } from "./frontend/src/Screens/EditProfile";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomDrawer from "./frontend/src/Components/ProfileDrawer";

const Nav = createNativeStackNavigator();

export default function App() {
    const [drawerVisible, setDrawerVisible] = useState(false);

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };
    return (
        <NavigationContainer>
            <Nav.Navigator initialRouteName="ProfilePage">
                <Nav.Screen
                    name="ProfilePage"
                    component={ProfilePage}
                    options={({ navigation }) => ({
                        header: () => <ProfileHeader toggleDrawer={toggleDrawer} navigation={navigation} />,
                    })}
                />
                <Nav.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={() => ({
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
                                <Text onPress={toggleDrawer}>
                                    <Icon name="menu" size={24} />
                                </Text>
                            </View> 
                        ),
                    })}
                />
            </Nav.Navigator>
            {drawerVisible && <CustomDrawer navigation={navigation} closeDrawer={closeDrawer} />}
        </NavigationContainer>
    );
}
