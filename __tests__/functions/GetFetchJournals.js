// Setting up the env variable.
process.env.ADMINISTRATOR_ROLE = 1;
const getFetchJournals = require('../../src/routers/functions/GetFetchJournals');

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ getJournalList: jest.fn().mockReturnValue(Promise.resolve([{ journal_entries: { sort: jest.fn() } }])) }));

describe('GetFetchJournals', () => {
  test('getJournalList without error role 1', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getJournalList } = require('../../src/MongoDB');

    const mockSortFn = jest.fn();
    getJournalList.mockReturnValue(Promise.resolve([{ journal_entries: { sort: mockSortFn } }]));

    await getFetchJournals(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getJournalList).toHaveBeenLastCalledWith({ readingId: 'readingId', userId: null });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockSortFn).toHaveBeenCalledTimes(1);
    // expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'readingId' });
  });

  test('getJournalList without error role 2', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { getJournalList } = require('../../src/MongoDB');

    const mockSortFn = jest.fn();
    getJournalList.mockReturnValue(Promise.resolve([{ journal_entries: { sort: mockSortFn } }]));

    await getFetchJournals(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getJournalList).toHaveBeenLastCalledWith({ readingId: 'readingId', userId: 'id' });
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockSortFn).toHaveBeenCalledTimes(1);
  });

  test('getJournalList with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { getJournalList } = require('../../src/MongoDB');
    getJournalList.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    const mockSortFn = jest.fn();

    await getFetchJournals(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getJournalList).toHaveBeenLastCalledWith({ readingId: 'readingId', userId: 'id' });
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockSortFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
