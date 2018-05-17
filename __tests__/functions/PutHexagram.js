// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const putHexagram = require('../../src/routers/functions/PutHexagram');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ updateHexagram: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('PostJournal', () => {
  test('updateHexagram without error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { updateHexagram } = require('../../src/MongoDB')

    await putHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateHexagram).toHaveBeenLastCalledWith({ id: 'journalId' });
    expect(res.sendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('updateHexagram with invalid user', () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ role: 2 });
    const { updateHexagram } = require('../../src/MongoDB');

    expect(() => putHexagram(req, res)).toThrow();

    // expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    // expect(updateHexagram).toHaveBeenLastCalledWith({ id: 'journalId' });
    // expect(res.sendStatus).not.toHaveBeenCalled();
    // expect(mockEndFn).not.toHaveBeenCalled();
    // expect(error).toHaveBeenCalledTimes(1);

  });

  test('updateHexagram with error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ role: 1 });
    const { updateHexagram } = require('../../src/MongoDB');
    const { error } = require('../../src/utils/Logger');
    updateHexagram.mockReturnValue(Promise.reject());

    await putHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateHexagram).toHaveBeenLastCalledWith({ id: 'journalId' });
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
