import fetchUnattachedJournalsControllers from '../../src/controllers/FetchUnattachedJournals';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Journal', () => ({ fetchUnattachedJournalList: jest.fn().mockReturnValue(Promise.resolve([{ journal_entries: { sort: jest.fn() } }])) }));

describe('FetchUnattachedJournals', () => {
  test('fetchUnattachedJournalList without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchUnattachedJournalList } = require('../../src/models/Journal');

    const mockSortFn = jest.fn();
    fetchUnattachedJournalList
      .mockReturnValue(Promise.resolve({ sort: mockSortFn }));

    await fetchUnattachedJournalsControllers(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchUnattachedJournalList).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockSortFn).toHaveBeenCalledTimes(1);
    // expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'readingId' });
  });

  test('fetchUnattachedJournalList with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { fetchUnattachedJournalList } = require('../../src/models/Journal');
    fetchUnattachedJournalList.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    const mockSortFn = jest.fn();

    await fetchUnattachedJournalsControllers(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchUnattachedJournalList).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockSortFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
