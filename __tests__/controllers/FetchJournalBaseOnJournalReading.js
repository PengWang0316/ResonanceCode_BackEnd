import fetchJournalBaseOnJournalReadingController from '../../src/controllers/FetchJournalBaseOnJournalReading';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ fetchJournalBasedOnReadingJournal: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('FetchJournalBaseOnJournalReading', () => {
  test('fetchJournalBaseOnJournalReading without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchJournalBasedOnReadingJournal } = require('../../src/models/Reading');

    await fetchJournalBaseOnJournalReadingController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchJournalBasedOnReadingJournal).toHaveBeenCalledTimes(1);
    expect(fetchJournalBasedOnReadingJournal).toHaveBeenLastCalledWith({ readingId: 'readingId', journalId: 'journalId', userId: 'id' });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
  });

  test('fetchJournalBaseOnJournalReading with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwtMessage: 'message', journalId: 'journalId', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchJournalBasedOnReadingJournal } = require('../../src/models/Reading');
    const { error } = require('../../src/utils/Logger');

    fetchJournalBasedOnReadingJournal.mockReturnValue(Promise.reject());

    await fetchJournalBaseOnJournalReadingController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchJournalBasedOnReadingJournal).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
