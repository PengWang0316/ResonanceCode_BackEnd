import getFetchHexagrams from '../../src/routers/functions/GetFetchHexagrams';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/MongoDB', () => ({ getHexagrams: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('GetFetchHexagrams', () => {
  test('getHexagrams without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { query: 'query' } };
    const { getHexagrams } = require('../../src/MongoDB');

    await getFetchHexagrams(req, res);
    expect(getHexagrams).toHaveBeenLastCalledWith({ query: 'query' });
    expect(getHexagrams).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('getHexagrams with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { query: 'query' } };
    const { getHexagrams } = require('../../src/MongoDB');
    getHexagrams.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchHexagrams(req, res);
    expect(getHexagrams).toHaveBeenLastCalledWith({ query: 'query' });
    expect(getHexagrams).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
