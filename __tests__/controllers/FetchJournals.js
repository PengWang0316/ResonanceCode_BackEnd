// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const fetchJournalsController = require('../../src/controllers/FetchJournals');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ fetchJournalList: jest.fn().mockReturnValue(Promise.resolve([{ journal_entries: { sort: jest.fn() } }])) }));

describe('FetchJournals', () => {
  test('fetchJournalList without error role 1', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchJournalList } = require('../../src/models/Reading');

    const mockSortFn = jest.fn();
    fetchJournalList.mockReturnValue(Promise.resolve([{ journal_entries: { sort: mockSortFn } }]));

    await fetchJournalsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchJournalList).toHaveBeenLastCalledWith({ readingId: 'readingId', userId: null });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockSortFn).toHaveBeenCalledTimes(1);
    // expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'readingId' });
  });

  test('fetchJournalList without error role 2', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { fetchJournalList } = require('../../src/models/Reading');

    const mockSortFn = jest.fn();
    fetchJournalList.mockReturnValue(Promise.resolve([{ journal_entries: { sort: mockSortFn } }]));

    await fetchJournalsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchJournalList).toHaveBeenLastCalledWith({ readingId: 'readingId', userId: 'id' });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockSortFn).toHaveBeenCalledTimes(1);
  });

  test('fetchJournalList with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { fetchJournalList } = require('../../src/models/Reading');
    fetchJournalList.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    const mockSortFn = jest.fn();

    await fetchJournalsController(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchJournalList).toHaveBeenLastCalledWith({ readingId: 'readingId', userId: 'id' });
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockSortFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
