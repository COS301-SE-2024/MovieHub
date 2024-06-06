export const launchImageLibraryAsync = jest.fn(() => {
    return Promise.resolve({
        cancelled: false,
        uri: "mock-uri",
    });
});

export const launchCameraAsync = jest.fn(() => {
    return Promise.resolve({
        cancelled: false,
        uri: "mock-camera-uri",
    });
});

export const requestMediaLibraryPermissionsAsync = jest.fn(() => {
    return Promise.resolve({
        granted: true,
        status: "granted",
    });
});
