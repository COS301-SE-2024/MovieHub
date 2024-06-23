// theme.js
export const colors = {
    primary: "#4A42C0", // Primary color
    accent: "#FF6347", // Accent color
    white: "#FFFFFF",
    black: "#000000",
    gray: "#D9D9D9",
    text: "#333333",
};

export const lightTheme = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    inputBackground: '#D9D9D9',
    primaryColor: '#0f5bd1',
    borderColor: '#cccccc',
    iconColor: '#000000',
    gray: "#7b7b7b",
};

export const darkTheme = {
    backgroundColor: '#1E1E1E',
    textColor: '#ffffff',
    inputBackground: '#333333',
    primaryColor: '#4A42C0',
    borderColor: '#555555',
    iconColor: '#ffffff',
    gray: "#D9D9D9",
};

export const themeStyles = {
    button: {
        backgroundColor: colors.primary,
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#aaa",
    },
    input: {
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.gray,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    textArea: {
        height: 100,
    },
    accentButton: {
        backgroundColor: colors.accent,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    accentButtonText: {
        color: colors.white,
        fontWeight: "bold",
    },  
};
