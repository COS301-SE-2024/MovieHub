// backend/tests/integration/users.integration.test.js
import request from 'supertest';
import app from '../Users/app.js';
import neo4j from 'neo4j-driver';
jest.mock('neo4j-driver');

describe('User API Integration Tests', () => {
    let mockSession;

    beforeAll(() => {
        mockSession = {
            run: jest.fn(),
            close: jest.fn(),
        };
        neo4j.driver.mockReturnValue({
            session: () => mockSession,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve a user profile', async () => {
        const userId = '123';
        const mockUser = { userId, name: 'John Doe' };

        mockSession.run.mockResolvedValue({
            records: [{ get: () => ({ properties: mockUser }) }],
        });

        const response = await request(app).get(`/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
        expect(mockSession.run).toHaveBeenCalledWith(
            'MATCH (u:User {userId: $id}) RETURN u',
            { id: userId }
        );
    });

    it('should update a user profile', async () => {
        const userId = '123';
        const updateData = { name: 'Jane Doe' };
        const mockUpdatedUser = { userId, ...updateData };

        mockSession.run.mockResolvedValue({
            records: [{ get: () => ({ properties: mockUpdatedUser }) }],
        });

        const response = await request(app)
            .put(`/users/${userId}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedUser);
        expect(mockSession.run).toHaveBeenCalledWith(
            'MATCH (u:User {userId: $id}) SET u += $updateData RETURN u',
            { id: userId, updateData }
        );
    });

    it('should delete a user profile', async () => {
        const userId = '123';

        mockSession.run.mockResolvedValue({});

        const response = await request(app).delete(`/users/${userId}`);

        expect(response.status).toBe(204);
        expect(mockSession.run).toHaveBeenCalledWith(
            'MATCH (u:User {userId: $id}) DELETE u',
            { id: userId }
        );
    });
});