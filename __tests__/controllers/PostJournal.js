import postJournal from '../../src/controllers/PostJournal';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../src/models/Reading', () => ({ createJournal: jest.fn().mockReturnValue(Promise.resolve()) }));
jest.mock('../../src/models/Journal', () => ({ createJournal: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('PostJournal', () => {
  test('createJournal reading without error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId', readings: { id: 1 } } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { createJournal } = require('../../src/models/Reading');

    await postJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(createJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId', readings: { id: 1 } });
    expect(res.sendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('createJournal reading with error', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId', readings: { id: 1 } } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { createJournal } = require('../../src/models/Reading');
    const { error } = require('../../src/utils/Logger');
    createJournal.mockReturnValue(Promise.reject());

    await postJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(createJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId', readings: { id: 1 } });
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
  });

  test('createJournal journal without error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId', readings: {} } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { createJournal } = require('../../src/models/Journal');

    await postJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(createJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId', readings: {} });
    expect(res.sendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('createJournal journal with error', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId', readings: {} } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { createJournal } = require('../../src/models/Journal');
    const { error } = require('../../src/utils/Logger');
    createJournal.mockReturnValue(Promise.reject());

    await postJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(createJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId', readings: {} });
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(2);
  });
});
