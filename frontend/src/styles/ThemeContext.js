import React, { createContext, useState, useContext } from 'react';
import { lightTheme, darkTheme } from './theme';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
