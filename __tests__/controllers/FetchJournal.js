import fetchJournalController from '../../src/controllers/FetchJournal';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Journal', () => ({ fetchUnattachedJournal: jest.fn().mockReturnValue(Promise.resolve()), fetchJournal: jest.fn().mockReturnValue(Promise.resolve()) }));
jest.mock('../../src/models/Reading', () => ({ fetchJournal: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('FetchJournal', () => {
  test('fetchJournal unattached journal without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', isUnattachedJournal: true } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchUnattachedJournal } = require('../../src/models/Journal');
    const { fetchJournal } = require('../../src/models/Reading');

    await fetchJournalController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(fetchUnattachedJournal).toHaveBeenLastCalledWith({ journalId: 'journalId', userId: 'id' });
    expect(fetchJournal).not.toHaveBeenCalled();
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
  });

  test('fetchJournal attached journal without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', isUnattachedJournal: false } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchUnattachedJournal } = require('../../src/models/Journal');
    const { fetchJournal } = require('../../src/models/Reading');

    await fetchJournalController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(fetchUnattachedJournal).toHaveBeenLastCalledWith({ journalId: 'journalId', userId: 'id' });
    expect(fetchJournal).toHaveBeenCalledTimes(1);
    expect(fetchJournal).toHaveBeenLastCalledWith({ journalId: 'journalId', userId: 'id' });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
  });

  test('fetchJournal attached journal with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', isUnattachedJournal: false } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchUnattachedJournal } = require('../../src/models/Journal');
    const { fetchJournal } = require('../../src/models/Reading');
    const { error } = require('../../src/utils/Logger');

    fetchJournal.mockReturnValue(Promise.reject());

    await fetchJournalController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(3);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(fetchJournal).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
