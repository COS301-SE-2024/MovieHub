import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const ws = useRef(null);
    const [existingRooms, setExistingRooms] = useState([]);

    useEffect(() => {
        const connect = () => {
            ws.current = new WebSocket('ws://192.168.193.139:3000');

            ws.current.onopen = () => {
                console.log('WebSocket connection opened');
                setSocket(ws.current);
            };

            ws.current.onclose = () => {
                console.log('WebSocket connection closed, attempting to reconnect...');
                setTimeout(connect, 3000); // Try to reconnect after 3 seconds
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connect();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};
