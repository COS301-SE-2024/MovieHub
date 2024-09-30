// authService.test.js
import { signUp, signIn, getUserProfile, updateUsername, updateBio, updateFullName } from '../services/authService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../Firebase/firebase.config';

// Mock the Firebase modules
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock('../Firebase/firebase.config', () => ({
  auth: {},
  db: {},
}));

describe('Auth Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('signUp', () => {
    test('should sign up a user and return the user object', async () => {
      const mockUser = { uid: '12345', email: 'test@example.com' };
      const mockUserCredential = { user: mockUser };

      // Mock the behavior of createUserWithEmailAndPassword
      createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);

      const email = 'test@example.com';
      const password = 'password123';
      const username = 'testUser';

      const user = await signUp(email, password, username);

      // Assertions
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
      expect(user).toEqual(mockUser);
    });

    test('should throw an error if sign up fails', async () => {
      const mockError = new Error('Sign up failed');

      // Mock the rejection of createUserWithEmailAndPassword
      createUserWithEmailAndPassword.mockRejectedValue(mockError);

      const email = 'test@example.com';
      const password = 'password123';
      const username = 'testUser';

      await expect(signUp(email, password, username)).rejects.toThrow('Sign up failed');
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
    });
  });

  describe('signIn', () => {
    test('should sign in a user and return the user object', async () => {
      const mockUser = { uid: '12345', email: 'test@example.com' };
      const mockUserCredential = { user: mockUser };

      // Mock the behavior of signInWithEmailAndPassword
      signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

      const email = 'test@example.com';
      const password = 'password123';

      const user = await signIn(email, password);

      // Assertions
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
      expect(user).toEqual(mockUser);
    });

    test('should throw an error if sign in fails', async () => {
      const mockError = new Error('Sign in failed');

      // Mock the rejection of signInWithEmailAndPassword
      signInWithEmailAndPassword.mockRejectedValue(mockError);

      const email = 'test@example.com';
      const password = 'password123';

      await expect(signIn(email, password)).rejects.toThrow('Sign in failed');
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
    });
  });

  describe('getUserProfile', () => {
    test('should return user data if user is found', async () => {
      const mockUserData = { username: 'testUser', email: 'test@example.com' };
      const mockDoc = { data: () => mockUserData };
      const mockQuerySnapshot = { empty: false, docs: [mockDoc] };

      // Mock Firestore functions
      collection.mockReturnValue('mockCollection');
      query.mockReturnValue('mockQuery');
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const email = 'test@example.com';
      const userData = await getUserProfile(email);

      // Assertions
      expect(collection).toHaveBeenCalledWith(db, 'users');
      expect(query).toHaveBeenCalledWith('mockCollection', where('email', '==', email));
      expect(getDocs).toHaveBeenCalledWith('mockQuery');
      expect(userData).toEqual(mockUserData);
    });

    test('should throw an error if user is not found', async () => {
      const mockQuerySnapshot = { empty: true, docs: [] };

      getDocs.mockResolvedValue(mockQuerySnapshot);

      const email = 'nonexistent@example.com';

      await expect(getUserProfile(email)).rejects.toThrow('User with the provided email not found');
      expect(getDocs).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('updateUsername', () => {
    test('should update the username successfully', async () => {
      const mockUid = '12345';
      const mockNewUsername = 'newUsername';

      const mockDocRef = {};
      doc.mockReturnValue(mockDocRef);

      await updateUsername(mockUid, mockNewUsername);

      // Assertions
      expect(doc).toHaveBeenCalledWith(db, 'users', mockUid);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { username: mockNewUsername });
    });

    test('should throw an error if updating username fails', async () => {
      const mockError = new Error('Update failed');
      updateDoc.mockRejectedValue(mockError);

      const mockUid = '12345';
      const mockNewUsername = 'newUsername';

      await expect(updateUsername(mockUid, mockNewUsername)).rejects.toThrow('Update failed');
    });
  });

  // Similar tests can be written for updateBio and updateFullName functions
});
