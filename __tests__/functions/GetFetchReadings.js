// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const getFetchReadings = require('../../src/routers/functions/GetFetchReadings');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ getRecentReadings: jest.fn().mockReturnValue(Promise.resolve({ id: 'readingId' })) }));

describe('GetFetchReadings', () => {
  test('getRecentReadings without error role 1', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', pageNumber: 1, numberPerpage: 15 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getRecentReadings } = require('../../src/MongoDB');

    await getFetchReadings(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getRecentReadings).toHaveBeenLastCalledWith(1, 15, null);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'readingId' });
  });

  test('getRecentReadings without error role 2', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', pageNumber: 1, numberPerpage: 15 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { getRecentReadings } = require('../../src/MongoDB');

    await getFetchReadings(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getRecentReadings).toHaveBeenLastCalledWith(1, 15, 'id');
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'readingId' });
  });

  test('getRecentReadings with invalid user no id', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { query: { jwt: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ role: 2 });
    const { getRecentReadings } = require('../../src/MongoDB');

    await getFetchReadings(req, res);
    expect(mockEndFn).toHaveBeenCalled();
  });

  test('getRecentReadings with invalid user no role', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { query: { jwt: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ id: 1 });
    const { getRecentReadings } = require('../../src/MongoDB');

    await getFetchReadings(req, res);
    expect(mockEndFn).toHaveBeenCalled();
  });

  test('getRecentReadings with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', pageNumber: 1, numberPerpage: 15 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { error } = require('../../src/utils/Logger');
    const { getRecentReadings } = require('../../src/MongoDB');
    getRecentReadings.mockReturnValue(Promise.reject());

    await getFetchReadings(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getRecentReadings).toHaveBeenLastCalledWith(1, 15, 'id');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
