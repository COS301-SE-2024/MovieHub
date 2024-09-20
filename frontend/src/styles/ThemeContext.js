import React, { createContext, useState, useContext } from "react";

// Create a Theme Context
const ThemeContext = createContext();

// Define themes
const lightTheme = {
    backgroundColor: "#fff",
    textColor: "#000",
    iconColor: "#000",
    gray: "#7b7b7b",
    inputBackground: '#D9D9D9',
    primaryColor: '#4A42C0',
    borderColor: '#cccccc',
    iconColor: '#000000',
};

const darkTheme = {
    backgroundColor: "#191919",
    textColor: "#fff",
    iconColor: "#fff",
    gray: "#aaa",
    inputBackground: '#333333',
    primaryColor: '#4A42C0',
    borderColor: '#555555',
    iconColor: '#ffffff',
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => setIsDarkMode((prevMode) => !prevMode);

    const theme = isDarkMode ? darkTheme : lightTheme;

    return <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);
