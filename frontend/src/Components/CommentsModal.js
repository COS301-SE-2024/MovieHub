import React, { useCallback, useMemo, forwardRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

const CommentsModal = forwardRef((props, ref) => {
    const { comments } = props;
    const [message, setMessage] = useState("");

    const snapPoints = useMemo(() => ["30%", "50%", "75%"], []);
    const renderBackdrop = useCallback((props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal ref={ref} index={2} snapPoints={snapPoints} enablePanDownToClose={true} handleIndicatorStyle={{ backgroundColor: "#4A42C0" }} backdropComponent={renderBackdrop}>
                <BottomSheetScrollView>
                    <View style={styles.bottomSheetContainer}>
                        <Text style={styles.bottomSheetHeader}>Comments</Text>
                        <View style={styles.commentsSection}>
                            {comments.map((comment, index) => (
                                <View key={index} style={styles.commentContainer}>
                                    <Image source={{ uri: comment.userAvatar }} style={styles.avatar} />
                                    <View style={styles.commentContent}>
                                        <View style={styles.commentHeader}>
                                            <Text style={styles.username}>{comment.username}</Text>
                                            <Text style={styles.date}>{comment.datePosted}</Text>
                                        </View>
                                        <Text style={styles.commentText}>{comment.text}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        {/* <TextInput style={styles.commentInput} placeholder="Add a comment..." value={comment} onChangeText={setComment} />
                        <TouchableOpacity style={styles.sendButton}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity> */}
                        <View style={styles.chatInput}>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.input} placeholder="Type a message..." value={message} onChangeText={setMessage} />
                                <TouchableOpacity>
                                    <Ionicons name="happy" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.sendButton}>
                                <Ionicons name="send" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
});

export default CommentsModal;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        flex: 1,
        padding: 16,
    },
    bottomSheetHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    commentsSection: {
        marginBottom: 16,
    },
    commentContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    username: {
        fontWeight: "bold",
        fontSize: 16,
    },
    date: {
        fontSize: 12,
        color: "gray",
    },
    commentText: {
        fontSize: 16,
        marginTop: 4,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
    chatInput: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#f1f1f1",
        alignSelf: "flex-end", // Align chat input to the bottom
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#f1f1f1",
        borderRadius: 20,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 40,
    },
    sendButton: {
        backgroundColor: "blue",
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
    },
});
