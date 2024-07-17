import React, { useCallback, useMemo, forwardRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { addCommentToPost } from "../Services/PostsApiServices";

const CommentsModal = forwardRef((props, ref) => {
    const { postId, userId, username, currentUserAvatar, comments, loadingComments, onFetchComments } = props;
    const [message, setMessage] = useState("");

    const snapPoints = useMemo(() => ["30%", "50%", "75%"], []);
    const renderBackdrop = useCallback((props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

    const formatTimeAgo = (date) => {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(seconds / 3600);
        const days = Math.floor(seconds / 86400);

        if (seconds < 60) return `${seconds}s`;
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    // difference between this function and the one above is that this one converts the date format from the db
    const formatTimeAgoFromDB = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return `${seconds}s ago`;
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 30) return `${days}d ago`;
        if (months < 12) return `${months}mo ago`;
        return `${years}y ago`;
    };

    const handleSendComment = async () => {
        if (message.trim()) {
            const newComment = {
                username: username,
                userAvatar: currentUserAvatar,
                datePosted: formatTimeAgo(new Date()), // Replace with formatted date
                text: message,
            };

            setMessage(""); // Clear input

            // TODO: **Add your comment logic here**
            try {
                const postBody = {
                    uid: userId,
                    text: message,
                    postId: postId,
                };
                const response = await addCommentToPost(postBody);
                // console.log("Comment added successfully:", response.data);
                onFetchComments(postId); // Refresh comments after adding a new one
            } catch (error) {
                console.error(error.message);
                throw new Error("Error adding comment:", +error.message);
            }
        }
    };

    // if (loadingComments) {
    //     return (
    //         <BottomSheetModalProvider>
    //             <BottomSheetModal ref={ref} index={2} snapPoints={snapPoints} enablePanDownToClose={true} handleIndicatorStyle={{ backgroundColor: "#4A42C0" }} backdropComponent={renderBackdrop}>
    //                 <View style={styles.loadingContainer}>
    //                     <ActivityIndicator size="large" color="#4A42C0" />
    //                 </View>
    //             </BottomSheetModal>
    //         </BottomSheetModalProvider>
    //     );
    // }

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal ref={ref} index={2} snapPoints={snapPoints} enablePanDownToClose={true} handleIndicatorStyle={{ backgroundColor: "#4A42C0" }} backdropComponent={renderBackdrop}>
                <BottomSheetScrollView>
                    <View style={styles.bottomSheetContainer}>
                        <Text style={styles.bottomSheetHeader}>Comments</Text>
                        {comments.length === 0 ? (
                            <View style={styles.noCommentsContainer}>
                                <Text style={{ fontWeight: "bold", fontSize: 18 }}>No comments yet</Text>
                                <Text style={{ color: "#7b7b7b", fontSize: 14, marginTop: 8 }}>Be the first to comment</Text>
                            </View>
                        ) : (
                            <View style={styles.commentsSection}>
                                {comments.map((comment, index) => (
                                    <View key={index} style={styles.commentContainer}>
                                        <Image source={{ uri: currentUserAvatar }} style={styles.avatar} />
                                        <View style={styles.commentContent}>
                                            <View style={styles.commentHeader}>
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={styles.username}>{username}</Text>
                                                    <Text style={styles.date}>{formatTimeAgoFromDB(comment.createdAt)}</Text>
                                                </View>
                                                <Ionicons name="heart-outline" size={18} color="black" />
                                            </View>
                                            <Text style={styles.commentText}>{comment.text}</Text>
                                            <Text style={styles.replyText}>Reply</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </BottomSheetScrollView>
                <View style={styles.chatInput}>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Type a message..." value={message} onChangeText={setMessage} />
                        <TouchableOpacity>
                            <Ionicons name="happy" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
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
    noCommentsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 60,
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
        alignContent: "center",
        justifyContent: "space-between",
    },
    username: {
        fontWeight: "bold",
        fontSize: 16,
    },
    date: {
        fontSize: 12,
        paddingLeft: 8,
        color: "gray",
        textAlignVertical: "center",
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
    replyText: {
        color: "grey",
        fontSize: 12,
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
        padding: 7,
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
});
