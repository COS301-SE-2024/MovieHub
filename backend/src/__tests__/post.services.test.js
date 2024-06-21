import {
    addPost,
    addCommentToPost,
    addCommentToComment,
    editPost,
    editComment,
    removePost,
    removeComment,
    getPostsOfMovie,
    getReviewsOfMovie,
    getCommentsOfPost,
    getPostsOfUser,
    getReviewsOfUser,
    getCommentsOfUser,
  } from '../Post/post.services'; // Assuming this is the correct path
//   const neo4j = //require('../neo4j');
//   jest.mock('../neo4j', () => ({
//     driver: {
//       session: jest.fn(),
//     },
//   }));
  
  describe('Post Services', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('addPost', () => {
      it('adds a Post to the database', async () => {
        // const sessionMock = {
        //   run: jest.fn().mockResolvedValue({
        //     records: [{
        //       get: jest.fn(() => ({
        //         properties: { id: 'PostId', text: 'Post text' },
        //       })),
        //     }],
        //   }),
        //   close: jest.fn(),
        // };
  
        //require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await addPost(	0,50014, 'Dammmmmmmmmmmmmmmmmmmm', true, 5);
  
        expect(result.text).toEqual('Dammmmmmmmmmmmmmmmmmmm');
       //expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('addCommentToPost', () => {
      it('adds a comment to the Post', async () => {
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
  
        //require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await addCommentToPost(0, 184, 'Comment text on Post');
  
        //expect(result).toEqual({ id: 'commentId', text: 'Comment text' });
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('addCommentToComment', () => {
      it('adds a comment to another comment', async () => {
        const sessionMock = {
          run: jest.fn().mockResolvedValue({
            records: [{
              get: jest.fn(() => ({
                properties: { id: 'commentId', text: 'Comment text on commnet' },
              })),
            }],
          }),
          close: jest.fn(),
        };
  
        //require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await addCommentToComment(0,132, 'Comment text on comment');
  
        //expect(result).toEqual({ id: 'commentId', text: 'Comment text' });
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('editPost', () => {
      it('edits the text of a Post', async () => {
        const sessionMock = {
          run: jest.fn().mockResolvedValue({
            records: [{
              get: jest.fn(() => ({
                properties: { id: 'PostId', text: 'Updated Post text' },
              })),
            }],
          }),
          close: jest.fn(),
        };
  
        //require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await editPost(184, 'Updated Post text');
  
        //expect(result).toEqual({ id: 'PostId', text: 'Updated Post text' });
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
  
        //require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        const result = await editComment(132, 'Updated comment text');
  
        //expect(result).toEqual({ id: 'commentId', text: 'Updated comment text' });
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('removePost', () => {
      it('removes a Post from the database', async () => {
        const sessionMock = {
          run: jest.fn(),
          close: jest.fn(),
        };
  
        //require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        await removePost(20);
  
  
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
    describe('removeComment', () => {
      it('removes a comment from the database', async () => {
        const sessionMock = {
          run: jest.fn(),
          close: jest.fn(),
        };
  
        //require('../neo4j').driver.session.mockReturnValue(sessionMock);
  
        await removeComment(135);
  
        expect(sessionMock.run).toHaveBeenCalled();
      });
    });
  
      
        describe('getPostsOfMovie', () => {
          it('gets all Posts of a movie', async () => {
            const sessionMock = {
              run: jest.fn().mockResolvedValue({
                records: [{
                  get: jest.fn(() => ({
                    properties: { id: 'PostId', text: 'Post text' },
                  })),
                }],
              }),
              close: jest.fn(),
            };
      
            //require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getPostsOfMovie(50014);
      
            //expect(result).toEqual([{ id: 'PostId', text: 'Post text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });

        describe('getReviewsOfMovie', () => {
          it('gets all Reviews of a movie', async () => {
            const sessionMock = {
              run: jest.fn().mockResolvedValue({
                records: [{
                  get: jest.fn(() => ({
                    properties: { id: 'PostId', text: 'Post text' },
                  })),
                }],
              }),
              close: jest.fn(),
            };
      
            //require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getReviewsOfMovie(50014);
            console.log(result);
            //console.log(result.id, result.post);
      
            //expect(result).toEqual([{ id: 'PostId', text: 'Post text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
      
        describe('getCommentsOfPost', () => {
          it('gets all comments of a Post', async () => {
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
      
            //require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getCommentsOfPost(128);
      
            //expect(result).toEqual([{ id: 'commentId', text: 'Comment text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
      
        describe('getPostsOfUser',  () => {
          it('gets all Posts made by a user', async () => {
            // const sessionMock = {
            //   run: jest.fn().mockResolvedValue({
            //     records: [{
            //       get: jest.fn(() => ({
            //         properties: { id: 'PostId', text: 'Post text' },
            //       })),
            //     }],
            //   }),
            //   close: jest.fn(),
            // };
      
            //require('../neo4j').driver.session.mockReturnValue(sessionMock);
            //console.log(await getPostsOfUser(0));
            const result = await getPostsOfUser(0);
                     
            
            ////expect(result).toEqual([{ id: 'PostId', text: 'Post text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
        
        describe('getReviewsOfUser', () => {
          it('gets all Reviews made by a user', async () => {
            // const sessionMock = {
            //   run: jest.fn().mockResolvedValue({
            //     records: [{
            //       get: jest.fn(() => ({
            //         properties: { id: 'PostId', text: 'Post text' },
            //       })),
            //     }],
            //   }),
            //   close: jest.fn(),
            // };
      
            //require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getReviewsOfUser(0);
            //console.log(result);
            ////expect(result).toEqual([{ id: 'PostId', text: 'Post text' }]);
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
      
            //require('../neo4j').driver.session.mockReturnValue(sessionMock);
      
            const result = await getCommentsOfUser(0);
      
            //expect(result).toEqual([{ id: 'commentId', text: 'Comment text' }]);
            expect(sessionMock.run).toHaveBeenCalled();
          });
        });
      });
      