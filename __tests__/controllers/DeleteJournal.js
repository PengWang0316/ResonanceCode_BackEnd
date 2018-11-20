import deleteJournalController from '../../src/controllers/DeleteJournal';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ deleteJournal: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('DeleteJournal', () => {
  test('deleteJournal without error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { body: { jwtMessage: 'message', readingIds: 'readingIds', journalId: 'journalId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteJournal } = require('../../src/models/Reading');

    await deleteJournalController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteJournal).toHaveBeenCalledTimes(1);
    expect(deleteJournal).toHaveBeenLastCalledWith({ userId: 'id', readingIds: 'readingIds', journalId: 'journalId' });
    expect(mocksendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('deleteJournal with error', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { body: { jwtMessage: 'message', readingIds: 'readingIds', journalId: 'journalId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteJournal } = require('../../src/models/Reading');
    deleteJournal.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await deleteJournalController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteJournal).toHaveBeenCalledTimes(2);
    expect(deleteJournal).toHaveBeenLastCalledWith({ userId: 'id', readingIds: 'readingIds', journalId: 'journalId' });
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
  });
});
