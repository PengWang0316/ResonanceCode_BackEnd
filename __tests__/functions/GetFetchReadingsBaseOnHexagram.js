// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const getFetchReadingsBaseOnHexagram = require('../../src/routers/functions/GetFetchReadingsBaseOnHexagram');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ getReadingsByHexagramId: jest.fn().mockReturnValue(Promise.resolve('result')) }));

describe('GetFetchReadingsBaseOnHexagram', () => {
  test('getReadingsByHexagramId without error role 1', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', imageArray: 'imageArray' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getReadingsByHexagramId } = require('../../src/MongoDB');

    await getFetchReadingsBaseOnHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getReadingsByHexagramId).toHaveBeenLastCalledWith('imageArray', null);
    expect(getReadingsByHexagramId).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('result');
  });

  test('getReadingsByHexagramId without error role 2', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', imageArray: 'imageArray' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'newId', role: 2 });
    const { getReadingsByHexagramId } = require('../../src/MongoDB');

    await getFetchReadingsBaseOnHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getReadingsByHexagramId).toHaveBeenLastCalledWith('imageArray', 'newId');
    expect(getReadingsByHexagramId).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('result');
  });

  test('getReadingsByHexagramId with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', imageArray: 'imageArray' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getReadingsByHexagramId } = require('../../src/MongoDB');
    getReadingsByHexagramId.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchReadingsBaseOnHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getReadingsByHexagramId).toHaveBeenCalledTimes(3);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
