import postDeleteJournal from '../../src/routers/functions/PostDeleteJournal';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ deleteJournal: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('PostDeleteJournal', () => {
  test('postDeleteJournal without error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { body: { jwtMessage: 'message', readingIds: 'readingIds', journalId: 'journalId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteJournal } = require('../../src/MongoDB');

    await postDeleteJournal(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteJournal).toHaveBeenCalledTimes(1);
    expect(deleteJournal).toHaveBeenLastCalledWith({ userId: 'id', readingIds: 'readingIds', journalId: 'journalId' });
    expect(mocksendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('postDeleteJournal with error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { body: { jwtMessage: 'message', readingIds: 'readingIds', journalId: 'journalId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteJournal } = require('../../src/MongoDB');
    deleteJournal.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await postDeleteJournal(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteJournal).toHaveBeenCalledTimes(2);
    expect(deleteJournal).toHaveBeenLastCalledWith({ userId: 'id', readingIds: 'readingIds', journalId: 'journalId' });
    expect(mocksendStatus).not.toHaveBeenCalled();
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
