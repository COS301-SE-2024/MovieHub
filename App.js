import "regenerator-runtime/runtime";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, useTheme } from "./frontend/src/styles/ThemeContext";
import ProfilePage from "./frontend/src/Screens/ProfilePage";
import EditProfile from "./frontend/src/Screens/EditProfile";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomDrawer from "./frontend/src/Screens/ProfileDrawer";
import HomePage from "./frontend/src/Screens/HomePage";
import MainHeader from "./frontend/src/Components/MainHeader";
import SearchHeader from "./frontend/src/Components/SearchHeader";
import ProfileHeader from "./frontend/src/Components/ProfileHeader";
import LoginPage from "./frontend/src/Screens/LoginPage";
import SignupPage from "./frontend/src/Screens/SignupPage";
import LandingPage from "./frontend/src/Screens/LandingPage";
import SearchPage from "./frontend/src/Screens/SearchPage";
import GenrePage from "./frontend/src/Screens/GenrePage";
import HelpCentre from "./frontend/src/Screens/HelpCentre";
import FAQs from "./frontend/src/Screens/FAQs";
import AccountSettings from "./frontend/src/Screens/AccountSettings";
import AccountManagement from "./frontend/src/Screens/AccountManagement";
import GettingStarted from "./frontend/src/Screens/GettingStarted";
import CommunityGuidelines from "./frontend/src/Screens/Guidelines";
import SocialFeatures from "./frontend/src/Screens/SocialFeatures";
import UsingMovieHub from "./frontend/src/Screens/UsingMovieHub";
import PrivacyPolicy from "./frontend/src/Screens/PrivacyPolicy";
import TermsOfUse from "./frontend/src/Screens/TermsOfUse";
import ChangePassword from "./frontend/src/Screens/ChangePassword";
import MovieDescriptionPage from "./frontend/src/Screens/MovieDescriptionPage";
import CreatePost from "./frontend/src/Screens/CreatePost";
import CreateWatchlist from "./frontend/src/Screens/CreateWatchlist";
import AddMovies from "./frontend/src/Screens/AddMovies";
import Notifications from "./frontend/src/Screens/Notifications";
import WatchlistDetails from "./frontend/src/Screens/WatchlistDetails";
import EditWatchlist from "./frontend/src/Screens/EditWatchlist";

const Nav = createNativeStackNavigator();

export default function App() {
    const [navigationState, setNavigationState] = useState(null);
    const theme = useTheme();

    return (
        <ThemeProvider>
            <NavigationContainer
                ref={(nav) => {
                    if (nav) setNavigationState(nav);
                }}>
                <Nav.Navigator 
                    initialRouteName="LandingPage"
                    // screenOptions={{
                    //     headerStyle: {
                    //         backgroundColor: theme.backgroundColor,
                    //     }
                    // }}
                >
                    {/* <Nav.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} /> */}
                    {/* <Nav.Screen name="SignupPage" component={SignupPage} options={{ headerShown: false }} /> */}
                    {/* <Nav.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} /> */}

                    <Nav.Screen name="HomePage" component={HomePage} options={{ header: () => <MainHeader /> }} />
                    <Nav.Screen name="MovieDescriptionPage" component={MovieDescriptionPage} options={{ header: () => <MainHeader /> }} />
                    <Nav.Screen
                        name="ProfilePage"
                        component={ProfilePage}
                        options={({ navigation }) => ({
                            title: "",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerRight: () => (
                                <View style={{ marginRight: 10 }}>
                                    <Text onPress={() => navigation.navigate("CustomDrawer")}>
                                        <Icon name="menu" size={24} />
                                    </Text>
                                </View>
                            ),
                            headerTintColor: "black",
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
                                    <Text onPress={() => navigation.navigate("CustomDrawer")}>
                                        <Icon name="menu" size={24} />
                                    </Text>
                                </View>
                            ),
                        })}
                    />

                    <Nav.Screen
                        name="SearchPage"
                        component={SearchPage}
                        options={({ navigation }) => ({
                            title: "",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerTintColor: "black",
                        })}
                    />

                    <Nav.Screen
                        name="GenrePage"
                        component={GenrePage}
                        options={({ navigation }) => ({
                            title: "",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerTintColor: "black",
                        })}
                    />

                    <Nav.Screen
                        name="CreatePost"
                        component={CreatePost}
                        options={({ navigation }) => ({
                            title: "Create Post",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerTintColor: "black",
                        })}
                    />
                    <Nav.Screen name="CustomDrawer" component={CustomDrawer} options={{ title: "Settings and Activity"}} />
                    <Nav.Screen name="AccountSettings" component={AccountSettings} options={{ title: "Account Settings" }} />
                    <Nav.Screen name="ChangePassword" component={ChangePassword} options={{ title: "Change Password" }} />
                    <Nav.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ title: "Privacy Policy" }} />
                    <Nav.Screen name="TermsOfUse" component={TermsOfUse} options={{ title: "Terms of Use" }} />
                    <Nav.Screen name="HelpCentre" component={HelpCentre} options={{ title: "Help Centre" }} />
                    <Nav.Screen name="AccountManagement" component={AccountManagement} options={{ title: "Account Management" }} />
                    <Nav.Screen name="GettingStarted" component={GettingStarted} options={{ title: "Getting Started" }} />
                    <Nav.Screen name="CommunityGuidelines" component={CommunityGuidelines} options={{ title: "Community Guidelines" }} />
                    <Nav.Screen name="SocialFeatures" component={SocialFeatures} options={{ title: "Social Features" }} />
                    <Nav.Screen name="UsingMovieHub" component={UsingMovieHub} options={{ title: "Using MovieHub"}} />
                    <Nav.Screen name="FAQs" component={FAQs} />
                    <Nav.Screen
                        name="Notifications"
                        component={Notifications}
                        options={({ navigation }) => ({
                            title: "Notifications",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerTintColor: "black",
                        })}
                    />

                    <Nav.Screen
                        name="CreateWatchlist"
                        component={CreateWatchlist}
                        options={({ navigation }) => ({
                            title: "",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerTintColor: "black",
                        })}
                    />
                    <Nav.Screen
                        name="AddMovies"
                        component={AddMovies}
                        options={({ navigation }) => ({
                            title: "",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerTintColor: "black",
                        })}
                    />
                    <Nav.Screen
                        name="WatchlistDetails"
                        component={WatchlistDetails}
                        options={({ navigation }) => ({
                            title: "Watchlist Details",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerTintColor: "black",
                        })}
                    />

                    <Nav.Screen
                        name="EditWatchlist"
                        component={EditWatchlist}
                        options={({ navigation }) => ({
                            title: "Watchlist Details",
                            headerShadowVisible: false,
                            headerBackTitleVisible: false,
                            headerTintColor: "black",
                        })}
                    />
                </Nav.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
}
