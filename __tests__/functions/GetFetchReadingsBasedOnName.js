import getFetchReadingsBasedOnName from '../../src/routers/functions/GetFetchReadingsBasedOnName';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ fetchReadingsBaseOnName: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('GetJournal', () => {
  test('getFetchReadingsBasedOnName without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', keyWord: 'keyWord' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchReadingsBaseOnName } = require('../../src/MongoDB');

    await getFetchReadingsBasedOnName(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchReadingsBaseOnName).toHaveBeenCalledTimes(1);
    expect(fetchReadingsBaseOnName).toHaveBeenLastCalledWith({ user_id: 'id', keyWord: 'keyWord' });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ result: 'result' });
  });

  test('getFetchReadingsBasedOnName with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', keyWord: 'keyWord' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchReadingsBaseOnName } = require('../../src/MongoDB');
    fetchReadingsBaseOnName.mockReturnValue(Promise.reject());

    await getFetchReadingsBasedOnName(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchReadingsBaseOnName).toHaveBeenCalledTimes(2);
    expect(fetchReadingsBaseOnName).toHaveBeenLastCalledWith({ user_id: 'id', keyWord: 'keyWord' });
    expect(mockJsonFn).not.toHaveBeenCalled();
  });
});
