import getFetchAllReadingList from '../../src/routers/functions/GetFetchAllReadingList';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ fetchAllReadingList: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('GetJournal', () => {
  test('getFetchAllReadingList without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', numberPerpage: 20, pageNumber: 1 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchAllReadingList } = require('../../src/MongoDB');

    await getFetchAllReadingList(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchAllReadingList).toHaveBeenCalledTimes(1);
    expect(fetchAllReadingList).toHaveBeenLastCalledWith({ userId: 'id', pageNumber: 1, numberPerpage: 20 });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ result: 'result' });
  });

  test('getFetchAllReadingList with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', numberPerpage: 20, pageNumber: 1 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchAllReadingList } = require('../../src/MongoDB');
    fetchAllReadingList.mockReturnValue(Promise.reject());

    await getFetchAllReadingList(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchAllReadingList).toHaveBeenCalledTimes(2);
    expect(fetchAllReadingList).toHaveBeenLastCalledWith({ userId: 'id', pageNumber: 1, numberPerpage: 20 });
    expect(mockJsonFn).not.toHaveBeenCalled();
  });
});
