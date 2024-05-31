// src/__mocks__/firebase/auth.js
const mockAuth = {
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
};

const getAuth = jest.fn(() => mockAuth);

export {
  getAuth,
  mockAuth
};
