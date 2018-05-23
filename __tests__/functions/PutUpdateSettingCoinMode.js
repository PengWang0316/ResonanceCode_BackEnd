import putUpdateSettingCoinMode from '../../src/routers/functions/PutUpdateSettingCoinMode';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ updateUser: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));
jest.mock('../../src/utils/GetReturnUserObject', () => jest.fn().mockReturnValue('user object'));

describe('PutUpdateSettingCoinMode', () => {
  test('update user without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { body: { jwtMessage: 'message', coinMode: 'coinMode' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { updateUser } = require('../../src/MongoDB');

    await putUpdateSettingCoinMode(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenLastCalledWith('id', { 'settings.coinMode': 'coinMode' });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('user object');
  });

  test('update user with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { body: { jwtMessage: 'message', coinMode: 'coinMode' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { updateUser } = require('../../src/MongoDB');
    updateUser.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger')

    await putUpdateSettingCoinMode(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateUser).toHaveBeenCalledTimes(2);
    expect(updateUser).toHaveBeenLastCalledWith('id', { 'settings.coinMode': 'coinMode' });
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
