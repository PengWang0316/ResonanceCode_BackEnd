import deleteDeleteReadingController from '../../src/controllers/DeleteReading';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ deleteReading: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('DeleteReading', () => {
  test('deleteReading without error', async () => {
    const mockEndFn = jest.fn();
    const mocksendStatus = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mocksendStatus };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteReading } = require('../../src/models/Reading');

    await deleteDeleteReadingController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteReading).toHaveBeenCalledTimes(1);
    expect(deleteReading).toHaveBeenLastCalledWith({ userId: 'id', readingId: 'readingId' });
    expect(mocksendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('deleteReading with error', async () => {
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { query: { jwtMessage: 'message', readingId: 'readingId' } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { deleteReading } = require('../../src/models/Reading');
    deleteReading.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await deleteDeleteReadingController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(deleteReading).toHaveBeenCalledTimes(2);
    expect(deleteReading).toHaveBeenLastCalledWith({ userId: 'id', readingId: 'readingId' });
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
  });
});
