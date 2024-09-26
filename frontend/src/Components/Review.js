import React, { useRef, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, Share, Alert, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../styles/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../Services/UseridContext";
import { removeReview } from "../Services/PostsApiServices";
import { toggleLikeReview, checkUserLike } from "../Services/LikesApiService";
import { colors } from "../styles/theme";

export default function Review({
  reviewId,
  uid,
  username,
  userHandle,
  userAvatar,
  likes,
  comments,
  image,
  saves,
  reviewTitle,
  preview,
  dateReviewed,
  isUserReview,
  handleCommentPress,
  movieName,
  rating,
  onDelete,
  Otheruid
}) {
  const { theme } = useTheme();
  const [hasLiked, setHasLiked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { userInfo, setUserInfo } = useUser();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleLike = async () => {
    const body = {
      reviewId: reviewId,
      uid: uid,
    };

    try {
      await toggleLikeReview(body);
      setHasLiked(!hasLiked);
      setLikeCount(prevCount => (hasLiked ? prevCount - 1 : prevCount + 1));
      console.log('Toggle like successful');
    } catch (error) {
      console.error('Error toggling like:', error);
    }

    setLiked(!liked);
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const data = await checkUserLike(userInfo.userId, reviewId, 'Review');
        setHasLiked(data.hasLiked); // Adjust based on your backend response
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [userInfo.userId, reviewId]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        url: "",
        title: "MovieHub",
        message: "Check this movie review out on MovieHub: " + reviewTitle,
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

  // Function to remove reviews
  const handleRemoveReview = async (uid, reviewId) => {
    onDelete(reviewId);
    toggleModal();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundColor,
      paddingHorizontal: 25,
      paddingVertical: 15,
      borderBottomWidth: 0.3,
      borderBottomColor: theme.borderColor,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 50,
      marginRight: 10,
    },
    username: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textColor,
    },
    userHandle: {
      color: theme.gray,
    },
    reviewButton: {
      backgroundColor: colors.primary,
      padding: 8,
      borderRadius: 55,
      width: 90,
      justifyContent: "center",
      alignItems: "center",
    },
    reviewButtonText: {
      color: "white",
      fontWeight: "bold",
    },
    profileInfo: {
      flexDirection: "row",
      alignItems: "center",
    //   justifyContent: "space-between", // This ensures space between elements
    },
    reviewImage: {
      width: "100%",
      height: 300,
      marginTop: 10,
      borderRadius: 10,
    },
    reviewTitle: {
      fontWeight: "600",
      fontSize: 18,
      marginTop: 10,
      color: theme.textColor,
    },
    reviewPreview: {
      color: theme.gray,
      marginVertical: 10,
    },
    icon: {
      marginRight: 5,
    },
    statsContainer: {
        display: "flex",
        flexDirection: "row",
    },
    stats: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    statsNumber: {
      color: theme.textColor,
    },
    commentInput: {
      marginTop: 10,
      marginBottom: 10,
      color: theme.gray,
      fontSize: 13,
    },
    modalContainer: {
      position: "absolute",
      top: 50,
      right: 30,
      backgroundColor: "white",
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.45,
      shadowRadius: 3.84,
      elevation: 5,
      padding: 10,
      zIndex: 1000,
    },
    modalOption: {
      paddingVertical: 8,
      paddingHorizontal: 20,
    },
    modalText: {
      color: "black",
      fontSize: 16,
    },
    star: {
      marginRight: 5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.userHandle}>
            {userHandle} &bull; {dateReviewed}
          </Text>
        </View>
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.reviewButtonText}>Review</Text>
        </TouchableOpacity>
        <Pressable onPress={toggleModal} style={{ marginLeft: 10 }}>
          <Icon name="more-vert" size={20} />
        </Pressable>
      </View>

      {image ? <Image source={{ uri: image }} style={styles.reviewImage} /> : null}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.reviewTitle}>{movieName}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto" }}>
          <Text style={styles.star}>
            <Icon name="star" size={22} color={"gold"} />
          </Text>
          <Text>{rating}</Text>
        </View>
      </View>

      <Text style={styles.reviewTitle}>{reviewTitle}</Text>
      <Text style={styles.reviewPreview}>{preview}</Text>

      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.stats} onPress={toggleLike}>
          <Icon
            name={hasLiked ? 'favorite' : 'favorite-border'}
            size={20}
            color={hasLiked ? 'red' : 'black'}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.statsNumber}>{likeCount}</Text>
        </TouchableOpacity>
        <View style={styles.stats}>
          <Pressable
            onPress={() => {
              handleCommentPress(reviewId, true);
            }}>
            <CommIcon name="comment-outline" size={20} style={styles.icon} />
          </Pressable>
          <Text style={styles.statsNumber}>{comments}</Text>
        </View>
        <View style={{ flex: 1 }}></View>
                <Pressable onPress={handleShare}>
                    <CommIcon name="share-outline" size={20} color={theme.iconColor} style={styles.icon} />
                </Pressable>
      </View>

      {modalVisible && (
        <View style={styles.modalContainer}>
          {isUserReview ? (
            <>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  navigation.navigate("EditReview", {
                    username,
                    uid,
                    titleParam: reviewTitle,
                    thoughtsParam: preview,
                    imageUriParam: image,
                    reviewId,
                    ratingParam: rating,
                    movieName
                  });
                }}>
                <Text style={styles.modalText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleRemoveReview(Otheruid, reviewId)}>
                <Text style={styles.modalText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleRemoveReview(Otheruid, reviewId)}>
              <Text style={styles.modalText}>Report</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}