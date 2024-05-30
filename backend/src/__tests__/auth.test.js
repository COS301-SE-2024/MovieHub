import firebase from "../Firebase/firebaseConnection";
import { signUp, logIn, logOut } from '../path/to/your/authModule'; // Adjust the path as necessary

jest.mock('../Firebase/firebaseConnection'); // Mock the Firebase connection

describe('Firebase Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('signUp should create a user', async () => {
    const mockUserCredential = { user: { email: 'test@example.com' } };
    firebase.auth().createUserWithEmailAndPassword.mockResolvedValueOnce(mockUserCredential);

    const email = 'test@example.com';
    const password = 'password123';
    const user = await signUp(email, password);

    expect(firebase.auth().createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    expect(user).toEqual(mockUserCredential.user);
  });

  test('logIn should sign in a user', async () => {
    const mockUserCredential = { user: { email: 'test@example.com' } };
    firebase.auth().signInWithEmailAndPassword.mockResolvedValueOnce(mockUserCredential);

    const email = 'test@example.com';
    const password = 'password123';
    const user = await logIn(email, password);

    expect(firebase.auth().signInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    expect(user).toEqual(mockUserCredential.user);
  });

  test('logOut should sign out a user', async () => {
    firebase.auth().signOut.mockResolvedValueOnce(undefined);

    const logoutStatus = await logOut();

    expect(firebase.auth().signOut).toHaveBeenCalled();
    expect(logoutStatus).toBeUndefined();
  });
});
