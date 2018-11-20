import fetchHexagramBaseOnImgController from '../../src/controllers/FetchHexagramBasedOnImg';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/models/Hexagram', () => ({ fetchHexagramBasedOnImgArr: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('GetFetchHexagramBaseOnImg', () => {
  test('fetchHexagram without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { imgArray: 'imgArray' } };
    const { fetchHexagramBasedOnImgArr } = require('../../src/models/Hexagram');

    await fetchHexagramBaseOnImgController(req, res);
    expect(fetchHexagramBasedOnImgArr).toHaveBeenLastCalledWith('imgArray');
    expect(fetchHexagramBasedOnImgArr).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchHexagram with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { imgArray: 'imgArray' } };
    const { fetchHexagramBasedOnImgArr } = require('../../src/models/Hexagram');
    fetchHexagramBasedOnImgArr.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await fetchHexagramBaseOnImgController(req, res);
    expect(fetchHexagramBasedOnImgArr).toHaveBeenLastCalledWith('imgArray');
    expect(fetchHexagramBasedOnImgArr).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
