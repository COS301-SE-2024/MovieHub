// backend/tests/integration/users.integration.test.js
const request = require('supertest');
const app = require('../Users/app.js');
const neo4j = require('neo4j-driver');

jest.mock('neo4j-driver');

describe('User API Integration Tests', () => {
    it('should get user profile', async () => {
        const user = { userId: '123', name: 'John Doe' };

        neo4j.session.mockReturnValue({
            run: jest.fn().mockResolvedValue({ records: [{ get: () => user }] }),
            close: jest.fn(),
        });

        const response = await request(app).get('/users/123');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
    });

    it('should update user profile', async () => {
        const updatedUser = { userId: '123', name: 'John Smith' };

        neo4j.session.mockReturnValue({
            run: jest.fn().mockResolvedValue({ records: [{ get: () => updatedUser }] }),
            close: jest.fn(),
        });

        const response = await request(app)
            .put('/users/123')
            .send({ name: 'John Smith' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedUser);
    });
});
