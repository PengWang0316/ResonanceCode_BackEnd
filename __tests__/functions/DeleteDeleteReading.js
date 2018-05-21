import deleteDeleteReading from '../../src/routers/functions/DeleteDeleteReading';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ deleteReading: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('GetJournal', () => {
  test('deleteDeleteReading without error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteReading } = require('../../src/MongoDB');

    await deleteDeleteReading(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteReading).toHaveBeenCalledTimes(1);
    expect(deleteReading).toHaveBeenLastCalledWith({ userId: 'id', readingId: 'readingId' });
    expect(mocksendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('deleteDeleteReading with error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteReading } = require('../../src/MongoDB');
    deleteReading.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await deleteDeleteReading(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteReading).toHaveBeenCalledTimes(2);
    expect(deleteReading).toHaveBeenLastCalledWith({ userId: 'id', readingId: 'readingId' });
    expect(mocksendStatus).not.toHaveBeenCalled();
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
