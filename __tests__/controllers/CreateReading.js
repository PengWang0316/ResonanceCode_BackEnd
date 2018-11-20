import postReading from '../../src/controllers/CreateReading';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../src/models/Reading', () => ({ createReading: jest.fn() }));
jest.mock('../../src/models/Hexagram', () => ({ findHexagramImagesForReading: jest.fn().mockReturnValue(new Promise((resolve, reject) => resolve({ id: 'id' }))) }));

describe('PostReading', () => {
  test('Post reading with createReading error', async () => {
    const { error } = require('../../src/utils/Logger');
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { createReading } = require('../../src/models/Reading');
    const { findHexagramImagesForReading } = require('../../src/models/Hexagram');
    createReading.mockReturnValueOnce(new Promise((resolve, reject) => reject()));
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const req = { body: { jwtMessage: 'jwtMessage', reading: { date: '03/16/1982' } } };
    const res = { json: mockJsonFn, end: mockEnd };

    await postReading(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(createReading).toHaveBeenLastCalledWith({ date: new Date('03/16/1982'), user_id: 'id' });
    expect(error).toHaveBeenCalledTimes(1);
    expect(findHexagramImagesForReading).not.toHaveBeenCalled();
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockEnd).toHaveBeenCalled();
  });

  test('Post reading without error', async () => {
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { createReading } = require('../../src/models/Reading');
    const { findHexagramImagesForReading } = require('../../src/models/Hexagram');
    createReading.mockReturnValueOnce(new Promise((resolve, reject) => resolve({ a: 1, b: 2 })));
    const mockJsonFn = jest.fn();
    const req = { body: { jwtMessage: 'jwtMessage', reading: { date: '03/16/1982' } } };
    const res = { json: mockJsonFn };

    await postReading(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(createReading).toHaveBeenLastCalledWith({ date: new Date('03/16/1982'), user_id: 'id' });
    expect(findHexagramImagesForReading).toHaveBeenLastCalledWith({ a: 1, b: 2 });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'id' });
  });

  test('Post reading without user _id', async () => {
    const verifyJWT = require('../../src/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: null });
    const mockEndFn = jest.fn();
    const req = { body: { jwtMessage: 'jwtMessage', reading: {} } };
    const res = { end: mockEndFn };

    await postReading(req, res);

    expect(mockEndFn).toHaveBeenLastCalledWith('Invalid User.');
  });
});
