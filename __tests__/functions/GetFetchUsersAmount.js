import getFetchUsersAmount from '../../src/routers/functions/GetFetchUsersAmount';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ fetchUsersAmount: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('GetFetchUsersAmount', () => {
  test('fetchUsersAmount without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = {};
    const { fetchUsersAmount } = require('../../src/MongoDB');

    await getFetchUsersAmount(req, res);
    expect(fetchUsersAmount).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchUsersAmount with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = {};
    const { fetchUsersAmount } = require('../../src/MongoDB');
    fetchUsersAmount.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchUsersAmount(req, res);
    expect(fetchUsersAmount).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
