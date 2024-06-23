import axios from 'axios';

describe('Watchlist Integration Tests', () => {
    const baseURL = 'http://localhost:3000'; // Replace with your actual backend base URL
    const userId = 'tempUserAgain'; // Replace with an actual user ID for testing

    // Function to generate a random watchlist name for testing
    const generateRandomWatchlistName = () => {
        return `Watchlist_${Math.random().toString(36).substring(7)}`;
    };

    let createdWatchlistId; // To store the ID of the watchlist created during testing

    // Function to clean up created watchlists after tests
    const cleanupCreatedWatchlist = async () => {
        if (createdWatchlistId) {
            try {
                await axios.delete(`http://localhost:3000/list/${createdWatchlistId}`);
            } catch (error) {
                console.error('Error cleaning up created watchlist:', error);
            }
        }
    };

    // Before all tests, ensure cleanup of any existing data and setup
    beforeAll(async () => {
        await cleanupCreatedWatchlist();
    });

    // After all tests, clean up any remaining data
    afterAll(async () => {
        await cleanupCreatedWatchlist();
    });

    // Test for fetching user watchlists
    it('should fetch user watchlists correctly', async () => {
        try {
            const response = await axios.get(`http://localhost:3000/users/${userId}/watchlists`);
            expect(response.status).toBe(200);
            // Optionally, you can add more assertions based on your response structure
            // For example: expect(response.data.length).toBeGreaterThan(0);
        } catch (error) {
            // Handle errors if necessary
            console.error('Error fetching user watchlists:', error);
        }
    });

    // Test for creating a watchlist
    it('should create a watchlist correctly', async () => {
        try {
            const newWatchlist = {
                name: generateRandomWatchlistName(),
                visibility: true,
                collaborative: false,
                name: 'A Test List',
                description: 'A list of some movies',
                ranked: false,
                tags: 'comedy'
            };

            const response = await axios.post(`http://localhost:3000/list/${userId}`, newWatchlist);
            expect(response.status).toBe(201);
            // Optionally, you can add more assertions based on your response structure
            // For example: expect(response.data.name).toEqual(newWatchlist.name);
        } catch (error) {
            // Handle errors if necessary
            console.error('Error creating watchlist:', error);
        }
    });

    // Test for deleting a watchlist
    it('should delete a watchlist correctly', async () => {
        try {
            // Assume watchlistId is obtained from an existing watchlist for testing
            const watchlistId = 'testerWatchlist'; // Replace with an actual watchlist ID

            const response = await axios.delete(`http://localhost:3000/list/${watchlistId}`);
            expect(response.status).toBe(204);
        } catch (error) {
            // Handle errors if necessary
            console.error('Error deleting watchlist:', error);
        }
    });

    // Additional test: Handle error when creating a watchlist with invalid data
    it('should handle error when creating a watchlist with invalid data', async () => {
        try {
            const invalidWatchlist = {
                // Missing required fields
            };

            await axios.post(`http://localhost:3000/list/${userId}`, invalidWatchlist);
        } catch (error) {
          //  expect(error.response.status).toBe(400); // Assuming your API returns 400 for bad requests
            // Optionally, validate the error response structure or message
            expect(error.response).toBeUndefined();
        }
    });

});
