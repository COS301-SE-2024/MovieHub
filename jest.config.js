module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest/setupTests.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-async-storage/async-storage|expo-modules-core|expo-image-picker)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
