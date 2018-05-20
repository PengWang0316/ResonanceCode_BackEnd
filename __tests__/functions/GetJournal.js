import getJournal from '../../src/routers/functions/GetJournal';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ fetchUnattachedJournal: jest.fn().mockReturnValue(Promise.resolve()), fetchJournal: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('GetJournal', () => {
  test('getJournal unattached journal without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', isUnattachedJournal: true } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchUnattachedJournal, fetchJournal } = require('../../src/MongoDB');

    await getJournal(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(fetchUnattachedJournal).toHaveBeenLastCalledWith({ journalId: 'journalId', userId: 'id' });
    expect(fetchJournal).not.toHaveBeenCalled();
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
  });

  test('getJournal attached journal without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', isUnattachedJournal: false } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchUnattachedJournal, fetchJournal } = require('../../src/MongoDB');

    await getJournal(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(fetchUnattachedJournal).toHaveBeenLastCalledWith({ journalId: 'journalId', userId: 'id' });
    expect(fetchJournal).toHaveBeenCalledTimes(1);
    expect(fetchJournal).toHaveBeenLastCalledWith({ journalId: 'journalId', userId: 'id' });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
  });

  test('getJournal attached journal without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', isUnattachedJournal: false } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchUnattachedJournal, fetchJournal } = require('../../src/MongoDB');
    const { error } = require('../../src/utils/Logger');

    fetchJournal.mockReturnValue(Promise.reject());

    await getJournal(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(3);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(fetchJournal).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(1);
  });
});
