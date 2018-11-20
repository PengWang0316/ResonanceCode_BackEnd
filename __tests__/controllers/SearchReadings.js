// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const searchReadingsController = require('../../src/controllers/SearchReadings');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ searchReadings: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('SearchReadings', () => {
  test('searchReadings role 1 without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', searchCriterias: { criterias: 'criterias' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { searchReadings } = require('../../src/models/Reading');
    const parseReturnValue = { criterias: 'criterias' };
    const mockParseFn = jest.fn().mockReturnValue(parseReturnValue);
    JSON = { parse: mockParseFn };

    await searchReadingsController(req, res);
    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(mockParseFn).toHaveBeenLastCalledWith({ criterias: 'criterias' });
    expect(parseReturnValue.userId).toBeUndefined();
    expect(searchReadings).toHaveBeenCalledTimes(1);
    expect(searchReadings).toHaveBeenLastCalledWith({ criterias: 'criterias' });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ result: 'result' });
  });

  test('searchReadings role 2 without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', searchCriterias: { criterias: 'criterias' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { searchReadings } = require('../../src/models/Reading');
    const parseReturnValue = { criterias: 'criterias' };
    const mockParseFn = jest.fn().mockReturnValue(parseReturnValue);
    JSON = { parse: mockParseFn };

    await searchReadingsController(req, res);
    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(mockParseFn).toHaveBeenLastCalledWith({ criterias: 'criterias' });
    expect(parseReturnValue.userId).toBe('id');
    expect(searchReadings).toHaveBeenCalledTimes(2);
    expect(searchReadings).toHaveBeenLastCalledWith({ criterias: 'criterias', userId: 'id' });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ result: 'result' });
  });

  test('searchReadings with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwt: 'message', searchCriterias: { criterias: 'criterias' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { searchReadings } = require('../../src/models/Reading');
    searchReadings.mockReturnValue(Promise.reject());
    const parseReturnValue = { criterias: 'criterias' };
    const mockParseFn = jest.fn().mockReturnValue(parseReturnValue);
    JSON = { parse: mockParseFn };
    const { error } = require('../../src/utils/Logger');

    await searchReadingsController(req, res);
    expect(verifyJWT).toHaveBeenCalledTimes(3);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(mockParseFn).toHaveBeenLastCalledWith({ criterias: 'criterias' });
    expect(searchReadings).toHaveBeenCalledTimes(3);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
