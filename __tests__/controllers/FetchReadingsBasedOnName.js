import fetchReadingsBasedOnNameController from '../../src/controllers/FetchReadingsBasedOnName';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ fetchReadingsBaseOnName: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('GetJournal', () => {
  test('fetchReadingsBasedOnName without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message', keyWord: 'keyWord' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchReadingsBaseOnName } = require('../../src/models/Reading');

    await fetchReadingsBasedOnNameController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchReadingsBaseOnName).toHaveBeenCalledTimes(1);
    expect(fetchReadingsBaseOnName).toHaveBeenLastCalledWith({ user_id: 'id', keyWord: 'keyWord' });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ result: 'result' });
  });

  test('fetchReadingsBasedOnName with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwtMessage: 'message', keyWord: 'keyWord' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchReadingsBaseOnName } = require('../../src/models/Reading');
    fetchReadingsBaseOnName.mockReturnValue(Promise.reject());

    await fetchReadingsBasedOnNameController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchReadingsBaseOnName).toHaveBeenCalledTimes(2);
    expect(fetchReadingsBaseOnName).toHaveBeenLastCalledWith({ user_id: 'id', keyWord: 'keyWord' });
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
