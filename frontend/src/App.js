import "regenerator-runtime/runtime";
import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
enableScreens();
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider, useTheme } from "./styles/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "./Services/UseridContext";
import ProfilePage from "./Screens/ProfilePage";
import EditProfile from "./Screens/EditProfile";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomDrawer from "./Screens/ProfileDrawer";
import HomePage from "./Screens/HomePage";
import Home from "./Screens/Home";
import MainHeader from "./Components/MainHeader";
import HomeHeader from "./Components/HomeHeader";
import SearchHeader from "./Components/SearchHeader";
import ProfileHeader from "./Components/ProfileHeader";
import LoginPage from "./Screens/LoginPage";
import SignupPage from "./Screens/SignupPage";
import ProfileSetup from "./Screens/ProfileSetupPage";
import LandingPage from "./Screens/LandingPage";
import ExplorePage from "./Screens/ExplorePage";
import SearchPage from "./Screens/SearchPage";
import GenrePage from "./Screens/GenrePage";
import HelpCentre from "./Screens/HelpCentre";
import FAQs from "./Screens/FAQs";
import AccountSettings from "./Screens/AccountSettings";
import AccountManagement from "./Screens/AccountManagement";
import GettingStarted from "./Screens/GettingStarted";
import CommunityGuidelines from "./Screens/Guidelines";
import SocialFeatures from "./Screens/SocialFeatures";
import UsingMovieHub from "./Screens/UsingMovieHub";
import PrivacyPolicy from "./Screens/PrivacyPolicy";
import TermsOfUse from "./Screens/TermsOfUse";
import ChangePassword from "./Screens/ChangePassword";
import MovieDescriptionPage from "./Screens/MovieDescriptionPage";
import CreatePost from "./Screens/CreatePost";
import EditPost from "./Screens/EditPost";
import EditReview from "./Screens/EditReview";
import CreateWatchlist from "./Screens/CreateWatchlist";
import AddMovies from "./Screens/AddMovies";
import Notifications from "./Screens/Notifications";
import WatchlistDetails from "./Screens/WatchlistDetails";
import EditWatchlist from "./Screens/EditWatchlist";
import WatchParty from "./Screens/WatchParty";
import HubScreen from "./Screens/HubScreen";
import CreateRoom from "./Screens/CreateRoom";
import ViewRoom from "./Screens/ViewRoom";
import ViewParticipants from "./Screens/ViewParticipants";
import FollowersProfilePage from "./Screens/FollowersProfilePage";
import FollowersPage from "./Screens/FollowersPage";
import FollowingPage from "./Screens/FollowingPage";
import LogBookScreen from "./Screens/LogBookScreen";
import LogEntriesScreen from "./Screens/LogEntriesScreen";
import Rooms from "./Screens/Rooms";
import CreateWatchParty from "./Screens/CreateWatchParty";
import VerificationPage from "./Screens/VerificationPage";
import ForgotPasswordPage from "./Screens/ForgotPassword";
import withTheme from "./Components/ThemeProviderHOC";

const Nav = createStackNavigator();

const ThemedStackNavigator = withTheme(({ theme }) => (
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
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />
        <Nav.Screen name="Home" component={Home} options={{ headerShown: false }} />

        <Nav.Screen
            name="MovieDescriptionPage"
            component={MovieDescriptionPage}
            options={{ headerShown: false }}
        />

        <Nav.Screen
            name="ExplorePage"
            component={ExplorePage}
            options={({ navigation }) => ({
                title: "Explore",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: "black",
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
                headerLeft: () => null,
            })}
        />
        <Nav.Screen
            name="FollowersPage"
            component={FollowersPage}
            options={({ navigation }) => ({
                title: "Followers",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />
        <Nav.Screen
            name="FollowingPage"
            component={FollowingPage}
            options={({ navigation }) => ({
                title: "Following",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />
        <Nav.Screen
            name="Profile"
            component={FollowersProfilePage}
            options={({ navigation }) => ({
                title: "Profile",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />
        <Nav.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={({ navigation, route }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerRight: () => (
                    <View style={{ marginRight: 10 }}>
                        <Text onPress={() => navigation.navigate("CustomDrawer", route)}>
                            <Icon name="menu" size={24} color={theme.textColor} />
                        </Text>
                    </View>
                ),
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
                headerLeft: () => null,
            })}
        />

        <Nav.Screen
            name="EditProfile"
            component={EditProfile}
            options={({ navigation, route }) => ({
                title: "Edit Profile",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="CreateWatchlist"
            component={CreateWatchlist}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="EditWatchlist"
            component={EditWatchlist}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="SearchPage"
            component={SearchPage}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
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
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
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
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="EditPost"
            component={EditPost}
            options={({ navigation }) => ({
                title: "Edit Post",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="EditReview"
            component={EditReview}
            options={({ navigation }) => ({
                title: "Edit Review",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="CustomDrawer"
            component={CustomDrawer}
            options={({ navigation }) => ({
                title: "Settings and Activity",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerTransparent: true,
                headerStyle: {
                    backgroundColor: "transparent",
                },
            })}
        />
        <Nav.Screen
            name="AccountSettings"
            component={AccountSettings}
            options={{
                title: "Account Settings",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />

        <Nav.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{
                title: "Change Password",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{
                title: "Privacy Policy",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="TermsOfUse"
            component={TermsOfUse}
            options={{
                title: "Terms of Use",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="HelpCentre"
            component={HelpCentre}
            options={{
                title: "Help Centre",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="AccountManagement"
            component={AccountManagement}
            options={{
                title: "Account Management",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="GettingStarted"
            component={GettingStarted}
            options={{
                title: "Getting Started",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="CommunityGuidelines"
            component={CommunityGuidelines}
            options={{
                title: "Community Guidelines",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="SocialFeatures"
            component={SocialFeatures}
            options={{
                title: "Social Features",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="UsingMovieHub"
            component={UsingMovieHub}
            options={{
                title: "Using MovieHub",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen 
            name="FAQs" 
            component={FAQs}
            options={{
                title: "FAQs",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
        />
        <Nav.Screen
            name="ViewRoom"
            component={ViewRoom}
            options={({ navigation }) => ({
                title: "Room",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
                headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                        <TouchableOpacity 
                            onPress={() => navigation.setParams({ openBottomSheet: true })}
                            style={{ marginRight: 15 }}
                            >
                            <Icon name="more-horiz" size={24} color={theme.textColor} />
                        </TouchableOpacity>
                    </View>
                  ),
        
            })}
        />
        <Nav.Screen
            name="ViewParticipants"
            component={ViewParticipants}
            options={{
                headerShown: false,
            }}
        />
        <Nav.Screen
            name="Notifications"
            component={Notifications}
            options={({ navigation }) => ({
                title: "Notifications",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="WatchlistDetails"
            component={WatchlistDetails}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="AddMovies"
            component={AddMovies}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="HubScreen"
            component={HubScreen}
            options={({ navigation }) => ({
                title: "The Hub",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
                headerLeft: () => null,
            })}
        />

        <Nav.Screen
            name="CreateRoom"
            component={CreateRoom}
            options={({ navigation }) => ({
                title: "Create a Room",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="WatchParty"
            component={WatchParty}
            options={({ navigation }) => ({
                headerShown: false,
            })}
        />

        <Nav.Screen
            name="LogBookScreen"
            component={LogBookScreen}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />
        <Nav.Screen
            name="LogEntriesScreen"
            component={LogEntriesScreen}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="Rooms"
            component={Rooms}
            options={({ navigation }) => ({
                title: "Rooms",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="CreateWatchParty"
            component={CreateWatchParty}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />
        <Nav.Screen
            name="VerificationPage"
            component={VerificationPage}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />

        <Nav.Screen
            name="ForgotPasswordPage"
            component={ForgotPasswordPage}
            options={({ navigation }) => ({
                title: "",
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: theme.textColor,
                headerStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            })}
        />
    </Nav.Navigator>
));

export default function App() {
    const [navigationState, setNavigationState] = useState(null);
    const theme = useTheme();

    return (
        // <WebSocketProvider>
        <UserProvider>
            <GestureHandlerRootView>
                <ThemeProvider>
                    <NavigationContainer
                        ref={(nav) => {
                            if (nav) setNavigationState(nav);
                        }}>
                        <ThemedStackNavigator />
                    </NavigationContainer>
                </ThemeProvider>
            </GestureHandlerRootView>
        </UserProvider>
    );
}
