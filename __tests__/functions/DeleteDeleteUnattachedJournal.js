import deleteDeleteUnattachedJournal from '../../src/routers/functions/DeleteDeleteUnattachedJournal';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ deleteUnattachedJournal: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('DeleteDeleteUnattachedJournal', () => {
  test('deleteDeleteUnattachedJournal without error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteUnattachedJournal } = require('../../src/MongoDB');

    await deleteDeleteUnattachedJournal(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteUnattachedJournal).toHaveBeenCalledTimes(1);
    expect(deleteUnattachedJournal).toHaveBeenLastCalledWith({ userId: 'id', journalId: 'journalId' });
    expect(mocksendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('deleteDeleteUnattachedJournal with error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteUnattachedJournal } = require('../../src/MongoDB');
    deleteUnattachedJournal.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await deleteDeleteUnattachedJournal(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteUnattachedJournal).toHaveBeenCalledTimes(2);
    expect(deleteUnattachedJournal).toHaveBeenLastCalledWith({ userId: 'id', journalId: 'journalId' });
    expect(mocksendStatus).not.toHaveBeenCalled();
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
