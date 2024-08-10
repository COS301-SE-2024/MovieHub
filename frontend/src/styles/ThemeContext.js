import React, { createContext, useState, useContext } from 'react';

// Create a Theme Context
const ThemeContext = createContext();

// Define themes
const lightTheme = {
    backgroundColor: '#fff',
    textColor: '#000',
    iconColor: '#000',
    gray: '#7b7b7b',
};

const darkTheme = {
    backgroundColor: '#000',
    textColor: '#fff',
    iconColor: '#fff',
    gray: '#aaa',
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);
