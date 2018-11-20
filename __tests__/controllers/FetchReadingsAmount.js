import fetchReadingsAmountController from '../../src/controllers/FetchReadingsAmount';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ fetchReadingsAmount: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('FetchReadingsAmount', () => {
  test('fetchReadingsAmount without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message' } };
    const { fetchReadingsAmount } = require('../../src/models/Reading');

    await fetchReadingsAmountController(req, res);
    expect(fetchReadingsAmount).toHaveBeenLastCalledWith('id');
    expect(fetchReadingsAmount).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchReadingsAmount with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwtMessage: 'message' } };
    const { fetchReadingsAmount } = require('../../src/models/Reading');
    fetchReadingsAmount.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await fetchReadingsAmountController(req, res);
    expect(fetchReadingsAmount).toHaveBeenLastCalledWith('id');
    expect(fetchReadingsAmount).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
