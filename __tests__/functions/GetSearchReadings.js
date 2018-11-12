// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const getSearchReadingsCall = require('../../src/routers/functions/GetSearchReadings');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ getSearchReadings: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('GetSearchReadings', () => {
  test('getSearchReadings role 1 without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', searchCriterias: { criterias: 'criterias' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getSearchReadings } = require('../../src/MongoDB');
    const parseReturnValue = { criterias: 'criterias' };
    const mockParseFn = jest.fn().mockReturnValue(parseReturnValue);
    JSON = { parse: mockParseFn };

    await getSearchReadingsCall(req, res);
    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(mockParseFn).toHaveBeenLastCalledWith({ criterias: 'criterias' });
    expect(parseReturnValue.userId).toBeUndefined();
    expect(getSearchReadings).toHaveBeenCalledTimes(1);
    expect(getSearchReadings).toHaveBeenLastCalledWith({ criterias: 'criterias' });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ result: 'result' });
  });

  test('getSearchReadings role 2 without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', searchCriterias: { criterias: 'criterias' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { getSearchReadings } = require('../../src/MongoDB');
    const parseReturnValue = { criterias: 'criterias' };
    const mockParseFn = jest.fn().mockReturnValue(parseReturnValue);
    JSON = { parse: mockParseFn };

    await getSearchReadingsCall(req, res);
    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(mockParseFn).toHaveBeenLastCalledWith({ criterias: 'criterias' });
    expect(parseReturnValue.userId).toBe('id');
    expect(getSearchReadings).toHaveBeenCalledTimes(2);
    expect(getSearchReadings).toHaveBeenLastCalledWith({ criterias: 'criterias', userId: 'id' });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ result: 'result' });

  });

  test('getSearchReadings with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', searchCriterias: { criterias: 'criterias' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getSearchReadings } = require('../../src/MongoDB');
    getSearchReadings.mockReturnValue(Promise.reject());
    const parseReturnValue = { criterias: 'criterias' };
    const mockParseFn = jest.fn().mockReturnValue(parseReturnValue);
    JSON = { parse: mockParseFn };
    const { error } = require('../../src/utils/Logger');

    await getSearchReadingsCall(req, res);
    expect(verifyJWT).toHaveBeenCalledTimes(3);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(mockParseFn).toHaveBeenLastCalledWith({ criterias: 'criterias' });
    expect(getSearchReadings).toHaveBeenCalledTimes(3);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
