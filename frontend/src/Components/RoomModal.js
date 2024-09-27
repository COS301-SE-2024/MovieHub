import React, { useCallback, useMemo, forwardRef, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { deleteRoom } from "../Services/RoomApiService";
import { inviteUserToRoom } from "../Services/RoomApiService";
import InviteModal from "../Components/InviteModal";

const RoomModal = forwardRef((props, ref) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const snapPoints = useMemo(() => ["42%"], []);
    const { isRoomCreator, userInfo, roomId, onSharePress, roomShortCode } = props;
    const bottomSheetRef = useRef(null);
    const renderBackdrop = useCallback((props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

    const handleCopyLinkPress = () => {
        console.log("Copy link");
    };

    const handleInvitePress = () => {
        bottomSheetRef.current?.present();
    };
    const handleInviteUser = async (friend) => {
        try {
            await inviteUserToRoom(userInfo.userId, friend.uid, roomId);
            Alert.alert("Success", `${friend.name} has been invited.`);
        } catch (error) {
            Alert.alert("Error", `Failed to invite ${friend.name}: ${error.message}`);
        }
    };

    const handleDeleteRoom = async () => {
        console.log("Delete Room");
        console.log(props);
        try {
            await deleteRoom(roomId);
            Alert.alert("Success", "Room deleted successfully!");
            navigation.navigate("HubScreen", { userInfo });
        } catch (error) {
            console.error("Error deleting room:", error);
            Alert.alert("Error", "Failed to delete room. Please try again later.");
        }
    };

    const handleStartWatchParty = () => {
        navigation.navigate("CreateWatchParty", { route: props.route, roomId: props.roomId, roomShortCode: props.roomShortCode });
        console.log("Start Watch Party");
    };

    const renderContent = () => (
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={handleInvitePress}>
                    <Ionicons name="share-social" size={22} color={theme.iconColor} style={styles.icon} />
                    <Text style={{ color: theme.textColor }}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleCopyLinkPress}>
                    <Ionicons name="link" size={22} color={theme.iconColor} style={styles.icon} />
                    <Text style={{ color: theme.textColor }}>Copy link</Text>
                </TouchableOpacity>
                {isRoomCreator && (
                    <>
                        <TouchableOpacity style={styles.iconButton} onPress={handleStartWatchParty}>
                            <Icon name="movie" size={22} color={theme.iconColor} style={styles.icon} />
                            <Text style={{ color: theme.textColor }}>Start Watch Party</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={handleDeleteRoom}>
                            <Ionicons name="trash" size={22} color="red" style={styles.icon} />
                            <Text style={{ color: "red" }}>Delete Room</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.backgroundColor,
            padding: 16,
            // height: "100%",
            zIndex: 12,
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            color: theme.textColor,
        },
        iconsContainer: {
            flexDirection: "column", // Corrected the flex direction
            justifyContent: "space-around",
            marginBottom: 16,
        },
        iconButton: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            padding: 6,
        },
        icon: {
            marginRight: 8,
        },
    });

    return (
        <>
            <BottomSheetModalProvider>
                <BottomSheetModal ref={ref} index={0} snapPoints={snapPoints} enablePanDownToClose={true} handleIndicatorStyle={{ backgroundColor: "#4A42C0" }} backgroundStyle={{ backgroundColor: theme.backgroundColor }} backdropComponent={renderBackdrop}>
                    <BottomSheetView style={{ backgroundColor: theme.backgroundColor }}>{renderContent()}</BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
            <InviteModal
                ref={bottomSheetRef}
                friends={[]} // Pass an empty array if there are no friends to invite
                title="Invite Friends"
                onInvite={handleInviteUser}
                userInfo={userInfo}
                roomId={roomId}
                route={props.route}
            />
        </>
    );
});

export default RoomModal;
