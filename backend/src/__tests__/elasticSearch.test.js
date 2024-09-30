// searchMoviesFuzzy.test.js
const { Client } = require('@elastic/elasticsearch');
const { searchMoviesFuzzy } = require('../searching/elasticSearchClient'); // Update the path accordingly

jest.mock('@elastic/elasticsearch'); // Mock Elasticsearch client

describe('searchMoviesFuzzy Function', () => {
  let mockElasticClient;

  beforeAll(() => {
    // Create a mock implementation for the Elasticsearch client
    mockElasticClient = {
      search: jest.fn()
    };
    Client.mockImplementation(() => mockElasticClient);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock history between tests
  });

  test('should return sorted movies with adjusted scores on successful search', async () => {
    // Mock response from Elasticsearch
    const mockResponse = {
      body: {
        hits: {
          hits: [
            { _score: 10, _source: { title: 'Movie A', popularity: 50 } },
            { _score: 15, _source: { title: 'Movie B', popularity: 30 } },
            { _score: 8, _source: { title: 'Movie C', popularity: 80 } }
          ]
        }
      }
    };
    mockElasticClient.search.mockResolvedValue(mockResponse);

    // Call the function with a test query
    const result = await searchMoviesFuzzy('test query');

    // Check that Elasticsearch search was called with the correct parameters
    expect(mockElasticClient.search).toHaveBeenCalledWith({
      index: 'movies',
      body: {
        query: {
          multi_match: {
            query: 'test query',
            fields: [
              'title^2',
              'tagline',
              'keywords^1.5',
              'overview',
              'credits^2.1'
            ],
            fuzziness: 'AUTO'
          }
        },
        size: 30
      }
    });

    // Verify the movies are sorted by adjusted score
    const sortedTitles = result.map(movie => movie._source.title);
    expect(sortedTitles).toEqual(['Movie B', 'Movie A', 'Movie C']);
  });

  test('should throw an error if Elasticsearch search fails', async () => {
    // Mock Elasticsearch to throw an error
    const mockError = new Error('Elasticsearch search failed');
    mockElasticClient.search.mockRejectedValue(mockError);

    // Check if the function throws the expected error
    await expect(searchMoviesFuzzy('test query')).rejects.toThrow('Elasticsearch search failed');

    // Check that search was called once
    expect(mockElasticClient.search).toHaveBeenCalledTimes(1);
  });

  test('should handle missing popularity field gracefully', async () => {
    // Mock response with missing popularity in some movies
    const mockResponse = {
      body: {
        hits: {
          hits: [
            { _score: 12, _source: { title: 'Movie D' } }, // No popularity field
            { _score: 15, _source: { title: 'Movie E', popularity: 0 } }, // Popularity is zero
            { _score: 10, _source: { title: 'Movie F', popularity: 70 } }
          ]
        }
      }
    };
    mockElasticClient.search.mockResolvedValue(mockResponse);

    const result = await searchMoviesFuzzy('another query');

    // Check that all movies are included and scores are calculated correctly
    const movieTitles = result.map(movie => movie._source.title);
    expect(movieTitles).toEqual(['Movie F', 'Movie E', 'Movie D']);
  });
});
