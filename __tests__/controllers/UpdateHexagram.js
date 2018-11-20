// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const putHexagram = require('../../src/controllers/UpdateHexagram');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Hexagram', () => ({ updateHexagram: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('PostJournal', () => {
  test('updateHexagram without error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { updateHexagram } = require('../../src/models/Hexagram')

    await putHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateHexagram).toHaveBeenLastCalledWith({ id: 'journalId' });
    expect(res.sendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('updateHexagram with invalid user', () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { body: { jwtMessage: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ role: 2 });
    const { updateHexagram } = require('../../src/models/Hexagram');

    putHexagram(req, res);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenLastCalledWith('Invalidated user');
  });

  test('updateHexagram with error', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { body: { jwtMessage: 'message', hexagram: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ role: 1 });
    const { updateHexagram } = require('../../src/models/Hexagram');
    const { error } = require('../../src/utils/Logger');
    updateHexagram.mockReturnValue(Promise.reject());

    await putHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateHexagram).toHaveBeenLastCalledWith({ id: 'journalId' });
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
  });
});
