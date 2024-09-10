import React, { useState, useEffect } from 'react';
import { View, Text, WebView } from 'react-native';
import firebase from 'firebase';

const WatchPartyScreen = ({ roomId }) => {
    const [embedUrl, setEmbedUrl] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Listen for WatchParty messages in the room
        const watchPartyRef = firebase.database().ref(`rooms/${roomId}/WatchParty`);

        const handleNewMessage = (snapshot) => {
            const message = snapshot.val();
            if (message.embed_url) {
                // Set the embed URL when the watch party is created
                setEmbedUrl(message.embed_url);
            }

            if (message.timestamp) {
                // Add new message with timestamp
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        };

        watchPartyRef.on('child_added', handleNewMessage);

        return () => {
            watchPartyRef.off('child_added', handleNewMessage);
        };
    }, [roomId]);

    return (
        <View style={{ flex: 1 }}>
            {embedUrl ? (
                // Dynamically display the iframe using WebView for React Native
                <WebView
                    source={{ uri: embedUrl }}
                    style={{ flex: 1 }}
                    allowsFullscreenVideo={true} // Enable fullscreen
                    javaScriptEnabled={true}      // Enable JavaScript
                />
            ) : (
                <Text>No active watch party</Text>
            )}

            <View style={{ padding: 10 }}>
                {messages.map((message, index) => (
                    <Text key={index}>
                        {`[${new Date(message.timestamp).toLocaleTimeString()}] ${message.text}`}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export default WatchPartyScreen;
