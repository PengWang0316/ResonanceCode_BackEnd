import getIsUserNameAvailable from '../../src/routers/functions/GetIsUserNameAvailable';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/MongoDB', () => ({ isUserNameAvailable: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('GetIsUserNameAvailable', () => {
  test('getIsUserNameAvailable without error', async () => {
    const mockSend = jest.fn();
    const res = { send: mockSend };
    const req = { query: { query: 'query' } };
    const { isUserNameAvailable } = require('../../src/MongoDB');

    await getIsUserNameAvailable(req, res);

    expect(isUserNameAvailable).toHaveBeenLastCalledWith({ query: 'query' });
    expect(mockSend).toHaveBeenLastCalledWith({ result: 'result' });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('getIsUserNameAvailable with error', async () => {
    const mockSend = jest.fn();
    const res = { send: mockSend };
    const req = { query: { query: 'query' } };
    const { isUserNameAvailable } = require('../../src/MongoDB');
    isUserNameAvailable.mockReturnValue(Promise.reject());

    await getIsUserNameAvailable(req, res);

    expect(isUserNameAvailable).toHaveBeenLastCalledWith({ query: 'query' });
    expect(mockSend).not.toHaveBeenCalled();
  });
});
