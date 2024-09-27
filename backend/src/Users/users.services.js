// backend/users/users.services.js
import { get, getDatabase, push, ref, set } from "firebase/database";
import { updateUserContent } from "../Post/post.services";


const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));

exports.getUserProfile = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run("MATCH (u:User {uid: $userId}) RETURN u", { userId });
        // console.log("Letssss see the result " , result);
        if (result.records.length === 0) {
            return null;
        }

        const profileGot = result.records[0].get('u').properties;

        if (profileGot.mode == null) {
            profileGot.mode = "light";
        }

        return profileGot;
    } finally {
        await session.close();
    }
};

exports.updateUserProfile = async (userId, updates) => {
    const session = driver.session();
    const query = `
    MATCH (u:User {uid: $userId})
    SET u += $updates
    RETURN u
  `;
    try {
        const result = await session.run(query, { userId, updates });
        if (result.records.length === 0) {
            return null;
        }
        updateUserContent(userId);
        return result.records[0].get("u").properties;
    } catch (error) {
        throw error;
    } finally {
        await session.close();
    }
};


exports.changeMode = async (uid, mode) => {
    console.log("In Services: changeMode");
    const session = driver.session();
    try {
        console.log(mode);
        const result = await session.run(
            `MATCH (u:User { uid: $uid})
             SET u.mode = $mode
             RETURN u`,
            {uid, mode}
        );
        if (result.records.length === 0) {
            throw new Error("User does not exist or is not autherized");
        }
        return result.records[0].get('u').properties;
    } catch (error) {
        console.error("Error changing mode: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.toggleMode = async (uid) => {
    console.log("In Services: toggleMode");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User { uid: $uid })
             RETURN u.mode AS currentMode`,
            { uid }
        );

        if (result.records.length === 0) {
            throw new Error("User not found");
        }

        // Get the current mode and determine the new mode
        const currentMode = result.records[0].get('currentMode');
        const newMode = (currentMode === 'light' || currentMode == null) ? 'dark' : 'light';

        // Set the new mode
        const updateResult = await session.run(
            `MATCH (u:User { uid: $uid })
             SET u.mode = $newMode
             RETURN u`,
            { uid, newMode }
        );

        return updateResult.records[0].get('u').properties.mode;
    } catch (error) {
        console.error("Error toggling mode: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getMode = async (uid) => {
    console.log("In Services: getMode");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User { uid: $uid})
             RETURN u`,
            {uid}
        );
        if (result.records.length === 0) {
            throw new Error("User does not exist");
        }
        const gotten = result.records[0].get('u').properties
        if (gotten.mode === undefined) {
            return "light"
        }else{
           return gotten.mode;
        }
    } catch (error) {
        console.error("Error getting mode: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.deleteUserProfile = async (userId) => {
    const session = driver.session();
    console.log("Inside services");
    try {
        const result = await session.run("MATCH (u:User {uid: $userId}) DETACH DELETE u RETURN count(u) as count", { userId: userId });
        // console.log(result);
        const count = result.records[0].get("count");
        console.log(count);
        return { success: count > 0 };
    } finally {
        await session.close();
    }
};

//For watchlist
exports.getUserWatchlists = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (u:User {uid: $userId})-[:HAS_WATCHLIST]->(w:Watchlist)
             RETURN w `,
            { userId }
        );

        // Log the query result
        console.log("Query result:", result);

        if (result.records.length === 0) {
            console.warn(`No watchlists found for userId: ${userId}`);
            return [];
        }

        const watchlists = result.records.map((record) => {
            console.log("Record:", record);
            return record.get("w").properties;
        });

        console.log("Watchlists:", watchlists);
        return watchlists;
    } finally {
        await session.close();
    }
};

exports.getUserPublicWatchlists = async (userId) => {
    const session = driver.session();

    try {
        const pub = true;
        const result = await session.run(
            `MATCH (u:User {uid: $userId})-[:HAS_WATCHLIST]->(w:Watchlist{visibility: $pub})
             RETURN w `,
            { userId, pub }
        );

        // Log the query result
        console.log("Query result:", result);

        if (result.records.length === 0) {
            console.warn(`No watchlists found for userId: ${userId}`);
            return [];
        }

        const watchlists = result.records.map((record) => {
            console.log("Record:", record);
            return record.get("w").properties;
        });

        console.log("Watchlists:", watchlists);
        return watchlists;
    } finally {
        await session.close();
    }
};

exports.createUserNode = async (uid, username) => {
    const session = driver.session();
    try {
        // Check if the username already exists
        const checkUsernameResult = await session.run("MATCH (u:User {username: $username}) RETURN u", { username });

        if (checkUsernameResult.records.length > 0) {
            // Username already exists
            throw new Error("Username already exists");
        }

        // Create the new user node
        const mode = "light";
        const createUserResult = await session.run("CREATE (u:User {uid: $uid, username: $username,mode :$mode  }) RETURN u", { uid, username,mode });

        return createUserResult.records[0].get("u");
    } catch (error) {
        throw error;
    } finally {
        await session.close();
    }
};

//Peer interactions
// Helper function to check for duplicate relationships and delete nodes without username
async function cleanUpDuplicateFollowRelationships(session, followerId, followeeId) {
    // const duplicateCheckQuery = `
    //     MATCH (follower:User {uid: $followerId})-[r:FOLLOWS]->(followee:User {uid: $followeeId})
    //     WITH r, count(r) AS relCount
    //     WHERE relCount > 1
    //     DELETE r
    // `;

    // await session.run(duplicateCheckQuery, { followerId, followeeId });

    // Delete user nodes without the username property
    const deleteQuery = `
      MATCH (u:User)
WHERE u.username IS NULL
DETACH DELETE u
    `;

    await session.run(deleteQuery);
}

// Follow a user
exports.followUser = async (followerId, followeeId) => {
    const session = driver.session();

    console.log("inside followUser services", followerId, followeeId);
    try {
        // Check if the follower already follows the followee
        const existingFollowResult = await session.run(
            `MATCH (follower:User {uid: $followerId})-[:FOLLOWS]->(followee:User {uid: $followeeId})
             RETURN count(followee) > 0 as alreadyFollowing`,
            { followerId, followeeId }
        );

        const alreadyFollowing = existingFollowResult.records[0].get("alreadyFollowing");

        if (alreadyFollowing) {
            // If already following, return a message
            return { message: "User is already following the followee", isFollowing: true };
        }

        // Create the follow relationship from follower to followee
        await session.run(
            `MERGE (follower:User {uid: $followerId})
             MERGE (followee:User {uid: $followeeId})
             MERGE (follower)-[:FOLLOWS]->(followee)`,
            { followerId, followeeId }
        );

       
        // Check if followee also follows the follower
        const result = await session.run(
            `MATCH (follower:User {uid: $followerId})-[:FOLLOWS]->(followee:User {uid: $followeeId})
             MATCH (followee)-[:FOLLOWS]->(follower)
             RETURN count(followee) > 0 as isMutualFollowing`,
            { followerId, followeeId }
        );

        const isMutualFollowing = result.records[0].get("isMutualFollowing");
        console.log("User services: isMutualFollowing", isMutualFollowing);

        // If both users are following each other, create FRIENDS relationship
        if (isMutualFollowing) {
            await session.run(
                `MERGE (follower:User {uid: $followerId})-[:FRIENDS]-(followee:User {uid: $followeeId})`,
                { followerId, followeeId }
            );
        }

        // Fetch follower's name
        const followerResult = await session.run(
            `MATCH (follower:User {uid: $followerId})
             RETURN follower.name AS followerName`,
            { followerId }
        );

        const validFollowerRecord = followerResult.records.find(
            record => record.get("followerName") !== null
        );

        if (!validFollowerRecord) {
            throw new Error("Follower name is missing for user with ID: " + followerId);
        }

        const followerName = validFollowerRecord.get("followerName");
        console.log("User services: follower name", followerName);

        // Send notification to the followee
        const db = getDatabase();
        const notificationRef = ref(db, `notifications/${followeeId}/follows/${followerId}`);
        const newNotificationRef = push(notificationRef);

        await set(newNotificationRef, {
            message: `${followerName} started following you`,  // Use follower's name in the notification
            notificationType: "follow",
            read: false,
            followerId: followerId,
            timestamp: new Date().toISOString(),
            isFollowing: isMutualFollowing,
        });

        // Clean up any duplicate follow relationships
        await cleanUpDuplicateFollowRelationships(session, followerId, followeeId);

        return { message: "Followed successfully", isFollowing: isMutualFollowing };
    } catch (error) {
        console.error("Error following user:", error);
        throw error;
    } finally {
        await session.close();
    }
};



// Unfollow a user
exports.unfollowUser = async (userId, targetUserId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `
            MATCH (u:User {uid: $userId})-[r:FOLLOWS]->(t:User {uid: $targetUserId})
            DELETE r
            RETURN u, t
            `,
            { userId, targetUserId }
        );

        if (result.records.length === 0) {
            throw new Error("Unfollow operation failed: relationship does not exist.");
        }

        return { success: true, message: "User unfollowed successfully" };
    } catch (error) {
        console.error("Error unfollowing user:", error);
        throw error;
    } finally {
        await session.close();
    }
};

// Get friends of a user
exports.getFriends = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (user:User {uid: $userId})-[:FRIENDS]-(friend:User)
             RETURN friend`,
            { userId }
        );

        const friends = result.records.map((record) => record.get("friend").properties);

        return friends;
    } catch (error) {
        console.error("Error fetching friends:", error);
        throw error;
    } finally {
        await session.close();
    }
};

// Get followers of a user
exports.getFollowers = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (follower:User)-[:FOLLOWS]->(user:User {uid: $userId})
             RETURN follower`,
            { userId }
        );

        const followers = result.records.map((record) => record.get("follower").properties);

        return followers;
    } catch (error) {
        console.error("Error fetching followers:", error);
        throw error;
    } finally {
        await session.close();
    }
};

// Get users that a user is following
exports.getFollowing = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (user:User {uid: $userId})-[:FOLLOWS]->(following:User)
             RETURN following`,
            { userId }
        );

        const following = result.records.map((record) => record.get("following").properties);

        return following;
    } catch (error) {
        console.error("Error fetching following users:", error);
        throw error;
    } finally {
        await session.close();
    }
};

// return whther a user is following another user
exports.isFollowing = async (userId, targetUserId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (user:User {uid: $userId})-[:FOLLOWS]->(following:User {uid: $targetUserId})
             RETURN following`,
            { userId, targetUserId }
        );

        return result.records.length > 0;
    } catch (error) {
        console.error("Error checking if user is following:", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getFollowerCount = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (follower:User)-[:FOLLOWS]->(user:User {uid: $userId})
             RETURN count(follower) AS followerCount`,
            { userId }
        );

        const followerCount = result.records[0].get("followerCount").toNumber();

        return followerCount;
    } catch (error) {
        console.error("Error fetching follower count:", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getFollowingCount = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (user:User {uid: $userId})-[:FOLLOWS]->(following:User)
             RETURN count(following) AS followingCount`,
            { userId }
        );

        const followingCount = result.records[0].get("followingCount").toNumber();

        return followingCount;
    } catch (error) {
        console.error("Error fetching following count:", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.searchUser = async (searchName) => {
    const session = driver.session();
    try {
        // Perform a fuzzy search on username and name
        const searchUserResult = await session.run(
            `
            MATCH (u:User)
            WHERE u.username =~ '(?i).*' + $searchName + '.*'
               OR u.name =~ '(?i).*' + $searchName + '.*'
            RETURN u
            `,
            { searchName }
        );

        // Check if any users matched the search
        if (searchUserResult.records.length === 0) {
            return []; // Return empty array if no matches
        }

        // Return all matched users
        return searchUserResult.records.map(record => record.get('u').properties);
    } catch (error) {
        throw error;
    } finally {
        await session.close();
    }
};

// Get user notifications from Firebase Realtime Database
exports.getUserNotifications = async (userId) => {
    const db = getDatabase();
    const notificationsRef = ref(db, `notifications/${userId}`);

    try {
        const snapshot = await get(notificationsRef);
        if (!snapshot.exists()) {
            console.warn(`No notifications found for userId: ${userId}`);
            return [];
        }

        const notifications = snapshot.val();
        return notifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

exports.getUnreadNotifications = async (userId) => {
    const db = getDatabase();
    const notificationsRef = ref(db, `notifications/${userId.id}`);

    try {
        const snapshot = await get(notificationsRef);
        if (!snapshot.exists()) {
            console.warn(`No notifications found for userId: ${userId}`);
            return { unreadCount: 0 };
        }

        const notifications = snapshot.val();
        console.log("Notifications:", notifications);

        if (!notifications) {
            return 0; // No notifications found
        }

        let unreadCount = 0;
        for (const key in notifications.comments) {
            if (notifications.comments[key].read === false) {
                unreadCount++;
            }
        }

        if (notifications.likes) {
            for (const key in notifications.likes) {
                if (notifications.likes[key].read === false) {
                    unreadCount++;
                }
            }
        }

        if (notifications.room_invitations) {
            for (const key in notifications.room_invitations) {
                if (notifications.room_invitations[key].read === false) {
                    unreadCount++;
                }
            }
        }


        console.log("Unread notifications count:", unreadCount);

        return { unreadCount };
    } catch (error) {
        console.error("Error fetching unread notifications:", error);
        throw error;
    }
};

// Close the driver when the application exits
process.on("exit", async () => {
    await driver.close();
});
