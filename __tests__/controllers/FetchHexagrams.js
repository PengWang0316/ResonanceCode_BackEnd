import getFetchHexagramsController from '../../src/controllers/FetchHexagrams';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/models/Hexagram', () => ({ fetchHexagrams: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('GetFetchHexagrams', () => {
  test('fetchHexagrams without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { query: 'query' } };
    const { fetchHexagrams } = require('../../src/models/Hexagram');

    await getFetchHexagramsController(req, res);
    expect(fetchHexagrams).toHaveBeenLastCalledWith({ query: 'query' });
    expect(fetchHexagrams).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchHexagrams with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { query: 'query' } };
    const { fetchHexagrams } = require('../../src/models/Hexagram');
    fetchHexagrams.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchHexagramsController(req, res);
    expect(fetchHexagrams).toHaveBeenLastCalledWith({ query: 'query' });
    expect(fetchHexagrams).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
