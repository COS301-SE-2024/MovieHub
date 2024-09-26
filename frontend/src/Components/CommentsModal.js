import React, { useCallback, useMemo, forwardRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, TouchableHighlight, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeContext";
import { addCommentToPost, addCommentToReview, removeComment, addCommentToComment, getCommentsOfComment } from "../Services/PostsApiServices";

const CommentsModal = forwardRef((props, ref) => {
    const { isPost, postId, userId, username, currentUserAvatar, comments, onFetchComments } = props;
    const { theme, isDarkMode } = useTheme();
    // console.log(isPost);
    const [message, setMessage] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [replies, setReplies] = useState({});
    const [expandedReplies, setExpandedReplies] = useState({});
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
                replyTo: replyTo ? replyTo.comId : null, // Add replyTo field if replying to a comment
            };

            setMessage(""); // Clear input
            setReplyTo(null); // Clear reply target

            try {
                const postBody = {
                    uid: userId,
                    text: message,
                    postId: postId,
                    replyTo: replyTo ? replyTo.comId : null, // Include replyTo in the request body
                };
                if (replyTo) {
                    const response = await addCommentToComment({ ...postBody, comOnId: replyTo.comId });
                    // console.log("Response CommentsModal:", response);
                } else {
                    const response = isPost ? await addCommentToPost(postBody) : await addCommentToReview({ ...postBody, reviewId: postId });
                }
                onFetchComments(postId, !isPost); // Refresh comments after adding a new one
            } catch (error) {
                console.error("Error adding comment:", error.message);
            }
        }
    };

    const toggleDeleteModal = (index) => {
        // check if it's my own comment
        if (comments[index].username !== username) {
            return;
        }
        setDeleteModalState((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index]; // Toggle delete modal state for the comment at index
            return newState;
        });
    };

    const handleDeleteComment = async (comment) => {
        // Implement your delete comment logic here
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

    const handleModalChange = (index) => {
        if (index === -1) {
            setReplyTo(null); // Reset replyTo state when modal is closed
        }
    };

    const fetchReplies = async (commentId) => {
        // console.log("Fetching replies for comment:", commentId);
        try {
            const response = await getCommentsOfComment(commentId);
            setReplies((prevReplies) => ({
                ...prevReplies,
                [commentId]: response.data, // Assuming response.data contains the list of replies
            }));
        } catch (error) {
            console.error("Error fetching replies:", error.message);
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    useEffect(() => {
        comments.forEach((comment) => {
            if (comment) {
                fetchReplies(comment.comId);
            }
        });
    }, [comments]);

    const styles = StyleSheet.create({
        bottomSheetContainer: {
            flex: 1,
            paddingBottom: 90,
            backgroundColor: theme.backgroundColor,
        },
        bottomSheetHeader: {
            fontSize: 20,
            fontWeight: "bold",
            padding: 16,
            color: theme.textColor,
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
        replyAvatar: {
            width: 35,
            height: 35,
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
            color: theme.textColor
        },
        date: {
            fontSize: 12,
            paddingLeft: 8,
            color: theme.gray,
            textAlignVertical: "center",
        },
        commentText: {
            fontSize: 16,
            marginTop: 4,
            color: theme.textColor
        },
        replyText: {
            color: theme.gray,
            fontSize: 12,
            marginTop: 4,
        },
        viewRepliesText: {
            color: "#4A42C0",
            marginLeft: 67,
            marginBottom: 8,
            fontSize: 12,
        },
        replyContainer: {
            flexDirection: "row",
            marginBottom: 16,
            marginLeft: 52,
        },
        chatInput: {
            flexDirection: "col",
            alignItems: "center",
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: isDarkMode? theme.borderColor : "#f1f1f1",
            alignSelf: "flex-end", // Align chat input to the bottom
            backgroundColor: theme.backgroundColor,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            backgroundColor: theme.inputBackground,
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
            backgroundColor: theme.backgroundColor,
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
        replyToContainer: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: isDarkMode ? theme.borderColor : "#f1f1f1",
            borderRadius: 20,
            marginBottom: 12,
            alignSelf: "flex-start",
        },
        replyToText: {
            fontWeight: "bold",
            marginRight: 8,
            color: theme.textColor,
        },
        replyContainer: {
            flexDirection: "row",
            padding: 16,
            paddingLeft: 40, // Indent replies
        },
    });

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal ref={ref} index={2} snapPoints={snapPoints} enablePanDownToClose={true} backgroundStyle={{ backgroundColor: theme.backgroundColor }} handleIndicatorStyle={{ backgroundColor: "#4A42C0" }} backdropComponent={renderBackdrop} onChange={handleModalChange}>
                <BottomSheetScrollView style={{ backgroundColor: theme.backgroundColor }}>
                    <View style={styles.bottomSheetContainer}>
                        <Text style={styles.bottomSheetHeader}>Comments</Text>
                        {comments.length === 0 ? (
                            <View style={styles.noCommentsContainer}>
                                <Text style={{ fontWeight: "bold", fontSize: 18, color: theme.textColor }}>No comments yet</Text>
                                <Text style={{ color: theme.gray, fontSize: 14, marginTop: 8 }}>Be the first to comment</Text>
                            </View>
                        ) : (
                            <View style={styles.commentsSection}>
                                {comments.map((comment, index) => (
                                    <View key={index}>
                                        <TouchableHighlight onLongPress={() => toggleDeleteModal(index)} underlayColor={"#f5f5f5"}>
                                            <View style={styles.commentContainer}>
                                                <Image source={{ uri: comment.avatar }} style={styles.avatar} />
                                                <View style={styles.commentContent}>
                                                    <View style={styles.commentHeader}>
                                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                            <Text style={styles.username}>{comment.username}</Text>
                                                            <Text style={styles.date}>{formatTimeAgoFromDB(comment.createdAt)}</Text>
                                                        </View>
                                                        <Ionicons name="heart-outline" size={18} color={theme.iconColor} />
                                                    </View>
                                                    <Text style={styles.commentText}>{comment.text}</Text>
                                                    <Text style={styles.replyText} onPress={() => setReplyTo(comment)}>
                                                        Reply
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableHighlight>

                                        {/* Display nested replies */}
                                        {replies[comment.comId] && (
                                            <>
                                                {replies[comment.comId].length > 1 && (
                                                    <Text style={styles.viewRepliesText} onPress={() => toggleReplies(comment.comId)}>
                                                        {expandedReplies[comment.comId] ? "Hide replies" : `View ${replies[comment.comId].length} more replies`}
                                                    </Text>
                                                )}
                                                {replies[comment.comId].length === 1 && (
                                                    <Text style={styles.viewRepliesText} onPress={() => toggleReplies(comment.comId)}>
                                                        {expandedReplies[comment.comId] ? "Hide replies" : `View ${replies[comment.comId].length} more reply`}
                                                    </Text>
                                                )}
                                                {expandedReplies[comment.comId] &&
                                                    replies[comment.comId].map((reply, replyIndex) => (
                                                        <View key={replyIndex} style={styles.replyContainer}>
                                                            <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
                                                            <View style={styles.commentContent}>
                                                                <View style={styles.commentHeader}>
                                                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                        <Text style={styles.username}>{reply.username}</Text>
                                                                        <Text style={styles.date}>{formatTimeAgoFromDB(reply.createdAt)}</Text>
                                                                    </View>
                                                                    <Ionicons name="heart-outline" size={18} color={theme.iconColor} />
                                                                </View>
                                                                <Text style={styles.commentText}>{reply.text}</Text>
                                                                <Text style={styles.replyText} onPress={() => setReplyTo(reply)}>
                                                                    Reply
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    ))}
                                            </>
                                        )}

                                        {/* Delete Comment Modal */}
                                        {deleteModalState[index] && (
                                            <View style={styles.deleteModalContainer}>
                                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteComment(comment)}>
                                                    <Text style={{ color: "red" }}>Delete</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.cancelButton} onPress={() => toggleDeleteModal(index)}>
                                                    <Text style={{ color: theme.textColor }}>Cancel</Text>
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
                    {replyTo && (
                        <View style={styles.replyToContainer}>
                            <Text style={styles.replyToText}>Replying to {replyTo.username}</Text>
                            <TouchableOpacity onPress={() => setReplyTo(null)}>
                                <Ionicons name="close-circle" size={20} color={theme.gray} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} placeholder="Type a message..." value={message} onChangeText={setMessage} placeholderTextColor={theme.gray} color={theme.textColor} />
                            {/* <TouchableOpacity>
                                <Ionicons name="happy" size={24} color="black" />
                            </TouchableOpacity> */}
                        </View>
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
                            <Ionicons name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
});

export default CommentsModal;


