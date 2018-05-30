import getFetchReadingsAmount from '../../src/routers/functions/GetFetchReadingsAmount';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ fetchReadingsAmount: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('GetFetchReadingsAmount', () => {
  test('fetchReadingsAmount without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message' } };
    const { fetchReadingsAmount } = require('../../src/MongoDB');

    await getFetchReadingsAmount(req, res);
    expect(fetchReadingsAmount).toHaveBeenLastCalledWith('id');
    expect(fetchReadingsAmount).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchReadingsAmount with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwtMessage: 'message' } };
    const { fetchReadingsAmount } = require('../../src/MongoDB');
    fetchReadingsAmount.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchReadingsAmount(req, res);
    expect(fetchReadingsAmount).toHaveBeenLastCalledWith('id');
    expect(fetchReadingsAmount).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
