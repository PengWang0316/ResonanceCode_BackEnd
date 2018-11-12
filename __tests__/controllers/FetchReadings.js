// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const getFetchReadingsController = require('../../src/controllers/FetchReadings');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ fetchRecentReadings: jest.fn().mockReturnValue(Promise.resolve({ id: 'readingId' })) }));

describe('GetFetchReadings', () => {
  test('fetchRecentReadings without error role 1', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', pageNumber: 1, numberPerpage: 15 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchRecentReadings } = require('../../src/models/Reading');

    await getFetchReadingsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchRecentReadings).toHaveBeenLastCalledWith(1, 15, null);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'readingId' });
  });

  test('fetchRecentReadings without error role 2', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', pageNumber: 1, numberPerpage: 15 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { fetchRecentReadings } = require('../../src/models/Reading');

    await getFetchReadingsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchRecentReadings).toHaveBeenLastCalledWith(1, 15, 'id');
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'readingId' });
  });

  test('fetchRecentReadings with invalid user no id', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { query: { jwt: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ role: 2 });
    const { fetchRecentReadings } = require('../../src/models/Reading');

    await getFetchReadingsController(req, res);
    expect(mockEndFn).toHaveBeenCalled();
  });

  test('fetchRecentReadings with invalid user no role', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { query: { jwt: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ id: 1 });
    const { fetchRecentReadings } = require('../../src/models/Reading');

    await getFetchReadingsController(req, res);
    expect(mockEndFn).toHaveBeenCalled();
  });

  test('fetchRecentReadings with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwt: 'message', pageNumber: 1, numberPerpage: 15 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { error } = require('../../src/utils/Logger');
    const { fetchRecentReadings } = require('../../src/models/Reading');
    fetchRecentReadings.mockReturnValue(Promise.reject());

    await getFetchReadingsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchRecentReadings).toHaveBeenLastCalledWith(1, 15, 'id');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
