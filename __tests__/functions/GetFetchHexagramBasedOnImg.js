import getFetchHexagramBaseOnImg from '../../src/routers/functions/GetFetchHexagramBasedOnImg';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/MongoDB', () => ({ fetchHexagram: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('GetFetchHexagramBaseOnImg', () => {
  test('fetchHexagram without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { imgArray: 'imgArray' } };
    const { fetchHexagram } = require('../../src/MongoDB');

    await getFetchHexagramBaseOnImg(req, res);
    expect(fetchHexagram).toHaveBeenLastCalledWith('imgArray');
    expect(fetchHexagram).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchHexagram with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { imgArray: 'imgArray' } };
    const { fetchHexagram } = require('../../src/MongoDB');
    fetchHexagram.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchHexagramBaseOnImg(req, res);
    expect(fetchHexagram).toHaveBeenLastCalledWith('imgArray');
    expect(fetchHexagram).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
