import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-dom';

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => 
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-image-picker
jest.mock('expo-image-picker');

// Mock native animated helper
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Example of how you can set up global variables if needed
global.expect = require('expect');
