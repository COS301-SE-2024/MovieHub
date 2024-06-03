// src/__mocks__/firebase/auth.js
const mockAuth = {
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
};

const getAuth = jest.fn(() => mockAuth);

module.exports = {
  getAuth,
  mockAuth,
  createUserWithEmailAndPassword: mockAuth.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockAuth.signInWithEmailAndPassword,
  signOut: mockAuth.signOut
};
