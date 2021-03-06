// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1; // This line has to be put on the first line.
const FetchAllHexagramsController = require('../../src/controllers/FetchAllHexagrams');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Hexagram', () => ({ fetchHexagrams: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('FetchAllHexagrams controller', () => {
  test('fetchHexagrams without error role 1', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchHexagrams } = require('../../src/models/Hexagram');

    await FetchAllHexagramsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchHexagrams).toHaveBeenLastCalledWith({});
    expect(fetchHexagrams).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
  });

  test('fetchHexagrams with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn, end: jest.fn() };
    const req = { query: { jwtMessage: 'message' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchHexagrams } = require('../../src/models/Hexagram');
    const { error } = require('../../src/utils/Logger');
    fetchHexagrams.mockReturnValue(Promise.reject());

    await FetchAllHexagramsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchHexagrams).toHaveBeenLastCalledWith({});
    expect(fetchHexagrams).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test('fetchHexagrams without error role 2', async () => {
    const mockJsonFn = jest.fn();
    const mockEndFn = jest.fn();
    const mockStatusFn = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { json: mockJsonFn, status: mockStatusFn };
    const req = { query: { jwtMessage: 'message' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    // const { fetchHexagrams } = require('../../src/models/Hexagram');

    await FetchAllHexagramsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockStatusFn).toHaveBeenLastCalledWith(401);
    expect(mockEndFn).toHaveBeenLastCalledWith('Unauthenticated User');
  });
});
