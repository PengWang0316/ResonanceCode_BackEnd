import putJournal from '../../src/controllers/UpdateJournal';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../src/MongoDB', () => ({ updateJournal: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('PostJournal', () => {
  test('updateJournal without error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { updateJournal } = require('../../src/MongoDB');

    await putJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId' });
    expect(res.sendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('updateJournal with error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId' } } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { updateJournal } = require('../../src/MongoDB');
    const { error } = require('../../src/utils/Logger');
    updateJournal.mockReturnValue(Promise.reject());

    await putJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId' });
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
