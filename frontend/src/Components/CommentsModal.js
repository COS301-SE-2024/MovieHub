import React, { useCallback, useMemo, forwardRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { getCommentsOfPost } from "../Services/PostsApiServices";


const CommentsModal = forwardRef((props, ref) => {
    // const { comments } = props;
    const { postId } = props;
    const { currentUser } = props;
    const { currentUserAvatar } = props;
    console.log("CommentsModal Post ID: ", postId);
    const [message, setMessage] = useState("");
    const mockComments = [
        {
            username: "user1",
            userAvatar: "https://via.placeholder.com/40",
            datePosted: "2024-07-16",
            text: "This is a sample comment.",
        },
        {
            username: "user2",
            userAvatar: "https://via.placeholder.com/40",
            datePosted: "2024-07-15",
            text: "Another sample comment.",
        },
    ]
    const [comments, setComments] = useState(mockComments);
    
    const snapPoints = useMemo(() => ["30%", "50%", "75%"], []);
    const renderBackdrop = useCallback((props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

    // converts Date to time ago
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

    // function for user to add comment to post
    const handleSendComment = () => {
        if (message.trim()) {
            const newComment = {
                username: currentUser,
                userAvatar: currentUserAvatar, 
                datePosted: formatTimeAgo(new Date()), // Replace with formatted date
                text: message,
            };

            setComments((prevComments) => [...prevComments, newComment]);
            setMessage(""); // Clear input
        
        // TODO: **Add your comment logic here**
        }
    };

    // TODO: **fetch comments of post**
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getCommentsOfPost(postId);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                } else {
                    throw new Error("Failed to fetch comments of post");
                }
            } catch (error) {
                console.error("Error fetching comments of post: ", error.message);
            }
        };
        fetchComments();
    }, [postId]);
    

    // TODO: **convert date format - so that it's shows from day posted, like 6h or 1d**
    

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
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                <Text style={styles.username}>{comment.username}</Text>
                                                <Text style={styles.date}>
                                                    {comment.datePosted}{/* TODO: replace with formatted date here */}
                                                </Text>
                                            </View>
                                            <Ionicons name="heart-outline" size={18} color="black" />
                                        </View>
                                        <Text style={styles.commentText}>{comment.text}</Text>
                                        <Text style={styles.replyText}>Reply</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </BottomSheetScrollView>
                <View style={styles.chatInput}>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Type a message..." value={message} onChangeText={setMessage} />
                        <TouchableOpacity>
                            <Ionicons name="happy" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendButton}  onPress={handleSendComment}>
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
});
