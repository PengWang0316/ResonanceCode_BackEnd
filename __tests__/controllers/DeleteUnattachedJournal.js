import deleteDeleteUnattachedJournalController from '../../src/controllers/DeleteUnattachedJournal';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Journal', () => ({ deleteUnattachedJournal: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('DeleteUnattachedJournal', () => {
  test('deleteUnattachedJournal without error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteUnattachedJournal } = require('../../src/models/Journal');

    await deleteDeleteUnattachedJournalController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(deleteUnattachedJournal).toHaveBeenLastCalledWith({ userId: 'id', journalId: 'journalId' });
    expect(mocksendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('deleteUnattachedJournal with error', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteUnattachedJournal } = require('../../src/models/Journal');
    deleteUnattachedJournal.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await deleteDeleteUnattachedJournalController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteUnattachedJournal).toHaveBeenCalledTimes(2);
    expect(deleteUnattachedJournal).toHaveBeenLastCalledWith({ userId: 'id', journalId: 'journalId' });
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
  });
});
