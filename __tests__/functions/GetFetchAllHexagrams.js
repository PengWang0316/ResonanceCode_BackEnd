// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const getFetchAllHexagrams = require('../../src/routers/functions/GetFetchAllHexagrams');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ getHexagrams: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('Get FetchAllHexagrams', () => {
  test('getHexagrams without error role 1', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getHexagrams } = require('../../src/MongoDB');

    await getFetchAllHexagrams(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getHexagrams).toHaveBeenLastCalledWith({});
    expect(getHexagrams).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
  });

  test('getHexagrams with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getHexagrams } = require('../../src/MongoDB');
    const { error } = require('../../src/utils/Logger');
    getHexagrams.mockReturnValue(Promise.reject());

    await getFetchAllHexagrams(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getHexagrams).toHaveBeenLastCalledWith({});
    expect(getHexagrams).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).not.toHaveBeenCalled();
  });

  test('getHexagrams without error role 2', async () => {
    const mockJsonFn = jest.fn();
    const mockEndFn = jest.fn();
    const mockStatusFn = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { json: mockJsonFn, status: mockStatusFn };
    const req = { query: { jwtMessage: 'message' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { getHexagrams } = require('../../src/MongoDB');

    await getFetchAllHexagrams(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockStatusFn).toHaveBeenLastCalledWith(401);
    expect(mockEndFn).toHaveBeenLastCalledWith('Unauthenticated User');
  });
});
