import isUserNameAvailableController from '../../src/controllers/IsUserNameAvailable';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/models/User', () => ({ isUserNameAvailable: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('GetIsUserNameAvailable', () => {
  test('getIsUserNameAvailable without error', async () => {
    const mockSend = jest.fn();
    const res = { send: mockSend };
    const req = { query: { query: 'query' } };
    const { isUserNameAvailable } = require('../../src/models/User');

    await isUserNameAvailableController(req, res);

    expect(isUserNameAvailable).toHaveBeenLastCalledWith({ query: 'query' });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenLastCalledWith(false);
  });

  test('getIsUserNameAvailable with error', async () => {
    const mockSend = jest.fn();
    const mockEnd = jest.fn();
    const res = { send: mockSend, end: mockEnd };
    const req = { query: { query: 'query' } };
    const { isUserNameAvailable } = require('../../src/models/User');
    isUserNameAvailable.mockReturnValue(Promise.reject());

    await isUserNameAvailableController(req, res);

    expect(isUserNameAvailable).toHaveBeenLastCalledWith({ query: 'query' });
    expect(mockSend).not.toHaveBeenCalled();
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
