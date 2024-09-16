import React from 'react';
import { useTheme } from '../styles/ThemeContext';
const withTheme = (WrappedComponent) => (props) => {
    const { theme } = useTheme();
    return <WrappedComponent {...props} theme={theme} />;
};

export default withTheme;
