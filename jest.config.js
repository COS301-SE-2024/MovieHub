module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./__test__/setupTests.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-async-storage/async-storage|expo-modules-core|expo-image-picker)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
