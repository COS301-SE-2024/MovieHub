import {
    addReview,
    addCommentToReview,
    addCommentToComment,
    editReview,
    editComment,
    removeReview,
    removeComment,
    toggleLikeReview,
    getReviewsOfMovie,
    getCommentsOfReview,
    getReviewsOfUser,
    getCommentsOfUser,
  } from '../Review/review.services'; // Assuming this is the correct path
  const neo4j = require('../neo4j');
  jest.mock('../neo4j', () => ({
    driver: {
      session: jest.fn(),
    },
  }));
  
  describe('Review Services', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('addReview', () => {
      it('adds a review to the database', async () => {
        const sessionMock = {
          run: jest.fn().mockResolvedValue({
            records: [{
              get: jest.fn(() => ({
                properties: { id: 'reviewId', text: 'Review text' },
              })),
            }],
          }),
          close: jest.fn(),
        };
  
        require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await addReview('userId', 'movieId', 'Review text');
  
        expect(result).toEqual({ id: 'reviewId', text: 'Review text' });
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('addCommentToReview', () => {
      it('adds a comment to the review', async () => {
        const sessionMock = {
          run: jest.fn().mockResolvedValue({
            records: [{
              get: jest.fn(() => ({
                properties: { id: 'commentId', text: 'Comment text' },
              })),
            }],
          }),
          close: jest.fn(),
        };
  
        require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await addCommentToReview('userId', 'reviewId', 'movieId', 'Comment text');
  
        expect(result).toEqual({ id: 'commentId', text: 'Comment text' });
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('addCommentToComment', () => {
      it('adds a comment to another comment', async () => {
        const sessionMock = {
          run: jest.fn().mockResolvedValue({
            records: [{
              get: jest.fn(() => ({
                properties: { id: 'commentId', text: 'Comment text' },
              })),
            }],
          }),
          close: jest.fn(),
        };
  
        require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await addCommentToComment('userId', 'commentId', 'movieId', 'Comment text');
  
        expect(result).toEqual({ id: 'commentId', text: 'Comment text' });
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('editReview', () => {
      it('edits the text of a review', async () => {
        const sessionMock = {
          run: jest.fn().mockResolvedValue({
            records: [{
              get: jest.fn(() => ({
                properties: { id: 'reviewId', text: 'Updated review text' },
              })),
            }],
          }),
          close: jest.fn(),
        };
  
        require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await editReview('reviewId', 'Updated review text');
  
        expect(result).toEqual({ id: 'reviewId', text: 'Updated review text' });
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('editComment', () => {
      it('edits the text of a comment', async () => {
        const sessionMock = {
          run: jest.fn().mockResolvedValue({
            records: [{
              get: jest.fn(() => ({
                properties: { id: 'commentId', text: 'Updated comment text' },
              })),
            }],
          }),
          close: jest.fn(),
        };
  
        require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await editComment('commentId', 'Updated comment text');
  
        expect(result).toEqual({ id: 'commentId', text: 'Updated comment text' });
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('removeReview', () => {
      it('removes a review from the database', async () => {
        const sessionMock = {
          run: jest.fn(),
          close: jest.fn(),
        };
  
        require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        await removeReview('reviewId');
  
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('removeComment', () => {
      it('removes a comment from the database', async () => {
        const sessionMock = {
          run: jest.fn(),
          close: jest.fn(),
        };
  
        require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        await removeComment('commentId');
  
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('toggleLikeReview', () => {
        it('toggles like status of a review for a user', async () => {
            const sessionMock = {
              run: jest.fn().mockResolvedValue({
                records: [{
                  get: jest.fn(() => true),
                }],
              }),
              close: jest.fn(),
            };
      
            require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await toggleLikeReview('userId', 'reviewId');
      
            expect(result).toBe(true);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
      
        describe('getReviewsOfMovie', () => {
          it('gets all reviews of a movie', async () => {
            const sessionMock = {
              run: jest.fn().mockResolvedValue({
                records: [{
                  get: jest.fn(() => ({
                    properties: { id: 'reviewId', text: 'Review text' },
                  })),
                }],
              }),
              close: jest.fn(),
            };
      
            require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getReviewsOfMovie('movieId');
      
            expect(result).toEqual([{ id: 'reviewId', text: 'Review text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
      
        describe('getCommentsOfReview', () => {
          it('gets all comments of a review', async () => {
            const sessionMock = {
              run: jest.fn().mockResolvedValue({
                records: [{
                  get: jest.fn(() => ({
                    properties: { id: 'commentId', text: 'Comment text' },
                  })),
                }],
              }),
              close: jest.fn(),
            };
      
            require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getCommentsOfReview('reviewId');
      
            expect(result).toEqual([{ id: 'commentId', text: 'Comment text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
      
        describe('getReviewsOfUser', () => {
          it('gets all reviews made by a user', async () => {
            const sessionMock = {
              run: jest.fn().mockResolvedValue({
                records: [{
                  get: jest.fn(() => ({
                    properties: { id: 'reviewId', text: 'Review text' },
                  })),
                }],
              }),
              close: jest.fn(),
            };
      
            require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getReviewsOfUser('userId');
      
            expect(result).toEqual([{ id: 'reviewId', text: 'Review text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
      
        describe('getCommentsOfUser', () => {
          it('gets all comments made by a user', async () => {
            const sessionMock = {
              run: jest.fn().mockResolvedValue({
                records: [{
                  get: jest.fn(() => ({
                    properties: { id: 'commentId', text: 'Comment text' },
                  })),
                }],
              }),
              close: jest.fn(),
            };
      
            require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getCommentsOfUser('userId');
      
            expect(result).toEqual([{ id: 'commentId', text: 'Comment text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
      });
      