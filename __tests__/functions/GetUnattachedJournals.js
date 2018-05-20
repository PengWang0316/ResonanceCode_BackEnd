import getUnattachedJournals from '../../src/routers/functions/GetUnattachedJournals';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ getUnattachedJournalList: jest.fn().mockReturnValue(Promise.resolve([{ journal_entries: { sort: jest.fn() } }])) }));

describe('GetFetchJournals', () => {
  test('getUnattachedJournalList without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { getUnattachedJournalList } = require('../../src/MongoDB');

    const mockSortFn = jest.fn();
    getUnattachedJournalList
      .mockReturnValue(Promise.resolve({ sort: mockSortFn }));

    await getUnattachedJournals(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getUnattachedJournalList).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockSortFn).toHaveBeenCalledTimes(1);
    // expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'readingId' });
  });

  test('getUnattachedJournalList with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: 'id', role: 2 });
    const { getUnattachedJournalList } = require('../../src/MongoDB');
    getUnattachedJournalList.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    const mockSortFn = jest.fn();

    await getUnattachedJournals(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(getUnattachedJournalList).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockSortFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
