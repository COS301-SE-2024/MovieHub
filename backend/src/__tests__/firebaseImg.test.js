// uploadImage.test.js
import { uploadImage } from '../services/imageHandeling.services';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Mock the Firebase storage methods
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock the Firebase storage import
jest.mock('../Firebase/firebase.config', () => ({
  storage: {},
}));

describe('uploadImage', () => {
  let file;

  beforeEach(() => {
    // Create a mock file object
    file = new File(['content'], 'testFile.jpg', { type: 'image/jpeg' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return file URL on successful upload', async () => {
    // Mock the behavior of ref, uploadBytes, and getDownloadURL
    const mockRef = { refPath: 'mockRefPath' };
    const mockSnapshot = { ref: mockRef };
    const mockURL = 'https://mock-url.com/mock-file.jpg';

    ref.mockReturnValue(mockRef);
    uploadBytes.mockResolvedValue(mockSnapshot);
    getDownloadURL.mockResolvedValue(mockURL);

    const result = await uploadImage(file);

    // Assertions
    expect(ref).toHaveBeenCalledWith({}, 'images/testFile.jpg');
    expect(uploadBytes).toHaveBeenCalledWith(mockRef, file);
    expect(getDownloadURL).toHaveBeenCalledWith(mockRef);
    expect(result).toBe(mockURL);
  });

  test('should log error and return undefined when no file is provided', async () => {
    console.error = jest.fn(); // Mock console.error

    const result = await uploadImage(null);

    // Assertions
    expect(console.error).toHaveBeenCalledWith('No file provided');
    expect(result).toBeUndefined();
  });

  test('should log error and return undefined on upload failure', async () => {
    console.error = jest.fn(); // Mock console.error
    const mockError = new Error('Upload failed');

    uploadBytes.mockRejectedValue(mockError);

    const result = await uploadImage(file);

    // Assertions
    expect(uploadBytes).toHaveBeenCalledWith(expect.anything(), file);
    expect(console.error).toHaveBeenCalledWith('Error uploading file:', mockError);
    expect(result).toBeUndefined();
  });
});
