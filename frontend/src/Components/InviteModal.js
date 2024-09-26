import React, { useState, useCallback, useMemo, useEffect, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Share, Alert, FlatList } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { getFriends, searchUser } from "../Services/UsersApiService"; // Import the getFriends function
import { useTheme } from "../styles/ThemeContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import SearchBar from '../Components/SearchBar';
import FollowList from '../Components/FollowList';
import { inviteUserToRoom } from '../Services/RoomApiService';

const InviteModal = forwardRef((props, ref) => {
    const snapPoints = useMemo(() => ["30%", "40%", "65%"], []);
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const { roomId } = props;

    const renderBackdrop = useCallback((props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const fetchedFriends = await getFriends(props.userInfo.userId); // Assuming props.userInfo contains user ID
                setFriends(fetchedFriends);
                setFilteredFriends(fetchedFriends);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch friends.");
                console.error("Failed to fetch friends:", error);
            }
        };

        fetchFriends();
    }, [props.userInfo.id]);

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredFriends(friends);
        } else {
            setFilteredFriends(friends.filter(friend =>
                friend.name.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        }
    }, [searchQuery, friends]);

    const handleCopyLinkPress = () => {
        console.log("Copy link");
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                url: '',
                title: 'MovieHub',
                message: "Watch Party Invite | Join my watch party at ...[link]",
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const handleInviteUser = (friend) => {
        props.onInvite(friend); // Call the onInvite prop to handle the invitation
    };

    const handleSearch = async (name) => {
        if (name.trim() === "") {
            setSearchResults([]); 
            return;
        }
        try {
            const response = await searchUser(name); 
            if (response.users) {
                setSearchResults(response.users);
            } else {
                setSearchResults([]); 
            }
        } catch (error) {
            console.error("Error during search:", error.message);
            setSearchResults([]); 
        }
    };

    const handleInvite = async (item) => {
        try {
            const response = await inviteUserToRoom(props.userInfo.userId, item.uid, roomId);
            Alert.alert("Success", "User invited successfully.");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const renderFollower = ({ item }) => (
        <TouchableOpacity onPress={() => handleInvite(item)}>
        <FollowList 
            username={item.username}
            userHandle={item.name}
            userAvatar={item.avatar}
        />
         </TouchableOpacity>
    );

    const renderContent = () => (
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>

            <View style={styles.icons}>
                <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                    <Ionicons name="share-social" size={22} color="black" />
                    <Text>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleCopyLinkPress}>
                    <Ionicons name="link" size={22} color="black" />
                    <Text>Copy link</Text>
                </TouchableOpacity>
            </View>

            <SearchBar onChangeText={handleSearch} />
                {searchResults.length > 0 && (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.uid}
                    renderItem={renderFollower}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.friendItem}>
                        <View style={styles.friendInfo}>
                            <View style={styles.avatar} />
                            <Text>{item.name}</Text>
                        </View>
                        <TouchableOpacity style={styles.inviteButton} onPress={() => handleInviteUser(item)}>
                            <Text>Invite</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
            padding: 16,
            height: "100%",
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            color: theme.textColor,
        },
        icons: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 16,
        },
        iconButton: {
            alignItems: "center",
        },
        searchBar: {
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginTop: 8,
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 20,
            marginBottom: 20,
        },
        input: {
            flex: 1,
            marginLeft: 10,
        },
        friendItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
        },
        friendInfo: {
            flexDirection: "row",
            alignItems: "center",
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#ccc",
            marginRight: 16,
        },
        inviteButton: {
            backgroundColor: "#f1f1f1",
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
    });

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={ref}
                index={2}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                handleIndicatorStyle={{ backgroundColor: "#4A42C0" }}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: theme.backgroundColor }}
            >
                <BottomSheetScrollView style={{ backgroundColor: theme.backgroundColor }}>
                    {renderContent()}
                </BottomSheetScrollView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
});



export default InviteModal;
