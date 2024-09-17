import "regenerator-runtime/runtime";
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider, useTheme } from "./frontend/src/styles/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProfilePage from "./frontend/src/Screens/ProfilePage";
import EditProfile from "./frontend/src/Screens/EditProfile";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomDrawer from "./frontend/src/Screens/ProfileDrawer";
import HomePage from "./frontend/src/Screens/HomePage";
import Home from "./frontend/src/Screens/Home";
import MainHeader from "./frontend/src/Components/MainHeader";
import HomeHeader from "./frontend/src/Components/HomeHeader";
import SearchHeader from "./frontend/src/Components/SearchHeader";
import ProfileHeader from "./frontend/src/Components/ProfileHeader";
import LoginPage from "./frontend/src/Screens/LoginPage";
import SignupPage from "./frontend/src/Screens/SignupPage";
import ProfileSetup from "./frontend/src/Screens/ProfileSetupPage";
import LandingPage from "./frontend/src/Screens/LandingPage";
import ExplorePage from "./frontend/src/Screens/ExplorePage";
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
import EditPost from "./frontend/src/Screens/EditPost";
import EditReview from "./frontend/src/Screens/EditReview";
import CreateWatchlist from "./frontend/src/Screens/CreateWatchlist";
import AddMovies from "./frontend/src/Screens/AddMovies";
import Notifications from "./frontend/src/Screens/Notifications";
import WatchlistDetails from "./frontend/src/Screens/WatchlistDetails";
import EditWatchlist from "./frontend/src/Screens/EditWatchlist";
import WatchParty from "./frontend/src/Screens/WatchParty";
import HubScreen from "./frontend/src/Screens/HubScreen";
import CreateRoom from "./frontend/src/Screens/CreateRoom";
import ViewRoom from "./frontend/src/Screens/ViewRoom";
import ViewParticipants from "./frontend/src/Screens/ViewParticipants";
import FollowersProfilePage from "./frontend/src/Screens/FollowersProfilePage";
import FollowersPage from "./frontend/src/Screens/FollowersPage";
import FollowingPage from "./frontend/src/Screens/FollowingPage";
import LogBookScreen from "./frontend/src/Screens/LogBookScreen";
import LogEntriesScreen from "./frontend/src/Screens/LogEntriesScreen";
import Rooms from "./frontend/src/Screens/Rooms";
import CreateWatchParty from "./frontend/src/Screens/CreateWatchParty";
import VerificationPage from "./frontend/src/Screens/VerificationPage";
import ForgotPasswordPage from "./frontend/src/Screens/ForgotPassword";
import {UserProvider} from "./frontend/src/Services/UseridContext";

const Nav = createStackNavigator();

export default function App() {
    const [navigationState, setNavigationState] = useState(null);
    const theme = useTheme();

    return (
        <UserProvider>
        <GestureHandlerRootView>
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
                        <Nav.Screen name="SignupPage" component={SignupPage} options={{ headerShown: false }} />
                        <Nav.Screen name="ProfileSetup" component={ProfileSetup} options={{ headerShown: false }} />
                        <Nav.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
                        <Nav.Screen
                            name="HomePage"
                            component={HomePage}
                            options={({ navigation }) => ({
                                title: "Explore",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />
                        <Nav.Screen name="Home" component={Home} options={{ headerShown: false }} />

                        <Nav.Screen
                            name="MovieDescriptionPage"
                            component={MovieDescriptionPage}
                            options={({ navigation }) => ({
                                title: "movieHub.",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "white",
                                headerTransparent: true, // Make the header transparent
                                headerStyle: {
                                    backgroundColor: "transparent",
                                },
                            })}
                        />

                        <Nav.Screen
                            name="ExplorePage"
                            component={ExplorePage}
                            options={({ navigation }) => ({
                                title: "Explore",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />
                        <Nav.Screen
                            name="FollowersPage"
                            component={FollowersPage}
                            options={({ navigation }) => ({
                                title: "Followers",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />
                        <Nav.Screen
                            name="FollowingPage"
                            component={FollowingPage}
                            options={({ navigation }) => ({
                                title: "Following",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />
                        <Nav.Screen
                            name="Profile"
                            component={FollowersProfilePage}
                            options={({ navigation }) => ({
                                title: "Profile",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />
                        <Nav.Screen
                            name="ProfilePage"
                            component={ProfilePage}
                            options={({ navigation }) => ({
                                title: "",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerRight: () => (
                                    <View style={{ marginRight: 20 }}>
                                        <Text onPress={() => navigation.navigate("CustomDrawer")}>
                                            <Icon name="menu" size={30} />
                                        </Text>
                                    </View>
                                ),
                                headerTintColor: "black",
                                headerStyle: {
                                    backgroundColor: "#fff",
                                },
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
                            name="EditWatchlist"
                            component={EditWatchlist}
                            options={({ navigation }) => ({
                                title: "",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
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
                                title: "movieHub.",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "white",
                                headerTransparent: true, // Make the header transparent
                                headerStyle: {
                                    backgroundColor: "transparent",
                                },
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

                        <Nav.Screen
                            name="EditPost"
                            component={EditPost}
                            options={({ navigation }) => ({
                                title: "Edit Post",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />

                        <Nav.Screen
                            name="EditReview"
                            component={EditReview}
                            options={({ navigation }) => ({
                                title: "Edit Review",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />

                        <Nav.Screen
                            name="CustomDrawer"
                            component={CustomDrawer}
                            options={({ navigation }) => ({
                                title: "Settings and Activity",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                                headerTransparent: true,
                                headerStyle: {
                                    backgroundColor: "transparent",
                                },
                            })}
                        />
                        <Nav.Screen name="AccountSettings" component={AccountSettings} options={{ title: "Account Settings", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />

                        <Nav.Screen name="ChangePassword" component={ChangePassword} options={{ title: "Change Password", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ title: "Privacy Policy", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="TermsOfUse" component={TermsOfUse} options={{ title: "Terms of Use", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="HelpCentre" component={HelpCentre} options={{ title: "Help Centre", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="AccountManagement" component={AccountManagement} options={{ title: "Account Management", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="GettingStarted" component={GettingStarted} options={{ title: "Getting Started", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="CommunityGuidelines" component={CommunityGuidelines} options={{ title: "Community Guidelines", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="SocialFeatures" component={SocialFeatures} options={{ title: "Social Features", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="UsingMovieHub" component={UsingMovieHub} options={{ title: "Using MovieHub", headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: "black" }} />
                        <Nav.Screen name="FAQs" component={FAQs} />
                        <Nav.Screen name="ViewRoom" component={ViewRoom} options={{ headerShown: false }} />
                        <Nav.Screen name="ViewParticipants" component={ViewParticipants} options={{ headerShown: false }} />
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
                            name="WatchlistDetails"
                            component={WatchlistDetails}
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
                            name="HubScreen"
                            component={HubScreen}
                            options={({ navigation }) => ({
                                title: "The Hub",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />

                        <Nav.Screen 
                            name="CreateRoom"
                            component={CreateRoom}
                            options={({ navigation }) => ({
                                title: "Create Room",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />

                        <Nav.Screen 
                            name="WatchParty"
                            component={WatchParty}
                            options={({ navigation }) => ({
                                headerShown: false
                            })}
                        />

                        <Nav.Screen
                            name="LogBookScreen"
                            component={LogBookScreen}
                            options={({ navigation }) => ({
                                title: "",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />
                        <Nav.Screen
                            name="LogEntriesScreen"
                            component={LogEntriesScreen}
                            options={({ navigation }) => ({
                                title: "",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />

                        <Nav.Screen
                            name="Rooms"
                            component={Rooms}
                            options={({ navigation }) => ({
                                title: "Rooms",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />

                        <Nav.Screen

                            name="CreateWatchParty"
                            component={CreateWatchParty}
                            options={({ navigation }) => ({
                                title: "",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />
                           <Nav.Screen
                            name="VerificationPage"
                            component={VerificationPage}
                            options={({ navigation }) => ({
                                title: "",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />

                        <Nav.Screen
                            name="ForgotPasswordPage"
                            component={ForgotPasswordPage}
                            options={({ navigation }) => ({
                                title: "",
                                headerShadowVisible: false,
                                headerBackTitleVisible: false,
                                headerTintColor: "black",
                            })}
                        />
                    </Nav.Navigator>
                </NavigationContainer>
            </ThemeProvider>
        </GestureHandlerRootView>
         </UserProvider>
    );
}
