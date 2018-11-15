import fetchUsersAmountController from '../../src/controllers/FetchUsersAmount';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/User', () => ({ fetchUsersAmount: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('FetchUsersAmount', () => {
  test('fetchUsersAmount without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = {};
    const { fetchUsersAmount } = require('../../src/models/User');

    await fetchUsersAmountController(req, res);
    expect(fetchUsersAmount).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchUsersAmount with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = {};
    const { fetchUsersAmount } = require('../../src/models/User');
    fetchUsersAmount.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await fetchUsersAmountController(req, res);
    expect(fetchUsersAmount).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
