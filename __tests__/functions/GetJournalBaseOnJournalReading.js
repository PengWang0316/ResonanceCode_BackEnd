import getJournalBaseOnJournalReading from '../../src/routers/functions/GetJournalBaseOnJournalReading';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ fetchJournalBasedOnReadingJournal: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('GetJournalBaseOnJournalReading', () => {
  test('getJournalBaseOnJournalReading without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchJournalBasedOnReadingJournal } = require('../../src/MongoDB');

    await getJournalBaseOnJournalReading(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchJournalBasedOnReadingJournal).toHaveBeenCalledTimes(1);
    expect(fetchJournalBasedOnReadingJournal).toHaveBeenLastCalledWith({ readingId: 'readingId', journalId: 'journalId', userId: 'id' });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
  });

  test('getJournalBaseOnJournalReading with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchJournalBasedOnReadingJournal } = require('../../src/MongoDB');
    const { error } = require('../../src/utils/Logger');

    fetchJournalBasedOnReadingJournal.mockReturnValue(Promise.reject());

    await getJournalBaseOnJournalReading(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchJournalBasedOnReadingJournal).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(1);
  });
});
