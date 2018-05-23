process.env.NORMAL_ROLE = 3;
process.env.JWT_SECERT = 'secert';
const getReturnUserObject = require('../../src/utils/GetReturnUserObject');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn().mockReturnValue('return value') }));

describe('GetReturnUserObject', () => {
  test('GetReturnUserObject has role', () => {
    const user = { role: 1, id: 'id' };
    const returnValue = getReturnUserObject(user);
    const { sign } = require('jsonwebtoken');
    expect(returnValue.user.isAuth).toBe(true);
    expect(returnValue.user.role).toBe(1);
    expect(returnValue.user.id).toBe('id');
    expect(user.isAuth).toBeUndefined();
    expect(sign).toHaveBeenLastCalledWith(returnValue.user, 'secert');
  });

  test('GetReturnUserObject without role', () => {
    const user = { id: 'id' };
    const returnValue = getReturnUserObject(user);
    const { sign } = require('jsonwebtoken');
    expect(returnValue.user.isAuth).toBe(true);
    expect(returnValue.user.id).toBe('id');
    expect(returnValue.user.role).toBe(3);
    expect(user.isAuth).toBeUndefined();
    expect(sign).toHaveBeenLastCalledWith(returnValue.user, 'secert');
  });
});
