// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const fetchReadingsBasedOnHexagramController = require('../../src/controllers/FetchReadingsBasedOnHexagram');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ fetchReadingsByHexagramId: jest.fn().mockReturnValue(Promise.resolve('result')) }));

describe('FetchReadingsBasedOnHexagram', () => {
  test('fetchReadingsByHexagramId without error role 1', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', imageArray: 'imageArray' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchReadingsByHexagramId } = require('../../src/models/Reading');

    await fetchReadingsBasedOnHexagramController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchReadingsByHexagramId).toHaveBeenLastCalledWith('imageArray', null);
    expect(fetchReadingsByHexagramId).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('result');
  });

  test('fetchReadingsByHexagramId without error role 2', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', imageArray: 'imageArray' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'newId', role: 2 });
    const { fetchReadingsByHexagramId } = require('../../src/models/Reading');

    await fetchReadingsBasedOnHexagramController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchReadingsByHexagramId).toHaveBeenLastCalledWith('imageArray', 'newId');
    expect(fetchReadingsByHexagramId).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('result');
  });

  test('fetchReadingsByHexagramId with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwt: 'message', imageArray: 'imageArray' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchReadingsByHexagramId } = require('../../src/models/Reading');
    fetchReadingsByHexagramId.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await fetchReadingsBasedOnHexagramController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchReadingsByHexagramId).toHaveBeenCalledTimes(3);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
