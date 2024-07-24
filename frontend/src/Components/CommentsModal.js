import React, { useCallback, useMemo, forwardRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, TouchableHighlight, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

import { addCommentToPost, addCommentToReview, removeComment } from "../Services/PostsApiServices";

const CommentsModal = forwardRef((props, ref) => {
    const { isPost, postId, userId, username, currentUserAvatar, comments, onFetchComments } = props;
    // console.log(isPost);
    const [message, setMessage] = useState("");
    const [deleteModalState, setDeleteModalState] = useState(Array(comments.length).fill(false)); // State to manage delete modals
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

            // TODO: Add your comment logic here
            try {
                if (isPost) {
                    const postBody = {
                        uid: userId,
                        text: message,
                        postId: postId,
                    };
                    const response = await addCommentToPost(postBody);
                    onFetchComments(postId, false); // Refresh comments after adding a new one
                } else {
                    const postBody = {
                        uid: userId,
                        text: message,
                        reviewId: postId,
                    }
                    console.log(postId);
                    const response = await addCommentToReview(postBody);
                    console.log("Response:", response);
                    onFetchComments(postId, true); // Refresh comments after adding a new one
                }
                console.log("Comment added successfully!");
            } catch (error) {
                console.error("Error adding comment:", error.message);
            }
        }
    };

    const toggleDeleteModal = (index) => {
        setDeleteModalState((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index]; // Toggle delete modal state for the comment at index
            return newState;
        });
    };

    const handleDeleteComment = async (comment) => {
        // Implement your delete comment logic here
        console.log(comment);
        try {
            const body = {
                uid: userId,
                commentId: comment.comId,
            };
            const response = await removeComment(body);
            Alert.alert("Success", "Comment deleted successfully!");
            isPost ? onFetchComments(postId, false) : onFetchComments(postId, true); // Refresh comments after deleting a comment
        } catch (error) {
            console.error("Error deleting comment:", error.message);
            throw new Error("Failed to delete comment");
        }
        // In this example, we're just closing the modal
        setDeleteModalState((prev) => {
            const newState = [...prev];
            newState[comment.comId] = false; // Close delete modal for the comment at index
            return newState;
        });
    };

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
                                    <View key={index}>
                                        <TouchableHighlight onLongPress={() => toggleDeleteModal(index)} underlayColor={"#f5f5f5"}>
                                            <View style={styles.commentContainer}>
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
                                        </TouchableHighlight>

                                        {/* Delete Comment Modal */}
                                        {deleteModalState[index] && (
                                            <View style={styles.deleteModalContainer}>
                                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteComment(comment)}>
                                                    <Text style={{ color: "red" }}>Delete</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.cancelButton} onPress={() => toggleDeleteModal(index)}>
                                                    <Text>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
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
        paddingBottom: 90,
    },
    bottomSheetHeader: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 16,
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
        padding: 16,
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
        backgroundColor: "#4a42c0",
        borderRadius: 20,
        padding: 7,
        marginLeft: 8,
    },
    deleteModalContainer: {
        position: "absolute",
        left: 30, // Adjust this as per your design
        top: 90, // Adjust this as per your design
        backgroundColor: "white",
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 100,
    },
    deleteButton: {
        padding: 8,
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 40,
    },
    cancelButton: {
        padding: 8,
        alignItems: "center",
        marginTop: 8,
        paddingLeft: 15,
        paddingRight: 40,
    },
});
