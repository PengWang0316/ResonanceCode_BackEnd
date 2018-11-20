import putUpdateJournalShareList from '../../src/controllers/UpdateJournalShareList';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ updateJournalShareList: jest.fn().mockReturnValue(Promise.resolve()) }));
jest.mock('../../src/models/User', () => ({ fetchUsersPushSubscriptions: jest.fn().mockReturnValue(Promise.resolve()) }));
jest.mock('../../src/utils/PushNotification', () => jest.fn());

describe('PutUpdateJournalShareList', () => {
  test('updateJournalShareList without error', async () => {
    const mockEndFn = jest.fn();
    const mockSendStatusFn = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mockSendStatusFn };
    const req = {
      body: {
        journalId: 'journalId', readingId: 'readingId', shareList: [{ id: 1 }, { id: 2 }, { id: 4 }], existedShareList: [1, 2, 3]
      },
    };
    const { updateJournalShareList } = require('../../src/models/Reading');
    const { fetchUsersPushSubscriptions } = require('../../src/models/User');
    const { error } = require('../../src/utils/Logger');
    const pushNotification = require('../../src/utils/PushNotification');

    await putUpdateJournalShareList(req, res);
    expect(updateJournalShareList).toHaveBeenCalledTimes(1);
    expect(updateJournalShareList).toHaveBeenLastCalledWith({
      journalId: 'journalId', readingId: 'readingId', shareList: [{ id: 1 }, { id: 2 }, { id: 4 }], userId: 'id'
    });
    expect(mockSendStatusFn).toHaveBeenLastCalledWith(200);
    expect(mockSendStatusFn).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(fetchUsersPushSubscriptions).toHaveBeenCalledTimes(1);
    expect(fetchUsersPushSubscriptions).toHaveBeenLastCalledWith([null, null, 4]);
    expect(pushNotification).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });

  test('updateJournalShareList without error fetchUsersPushSubscriptions with error', async () => {
    const mockEndFn = jest.fn();
    const mockSendStatusFn = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mockSendStatusFn };
    const req = {
      body: {
        journalId: 'journalId', readingId: 'readingId', shareList: [{ id: 1 }, { id: 2 }, { id: 4 }], existedShareList: [1, 2, 3]
      },
    };
    const { updateJournalShareList } = require('../../src/models/Reading');
    const { fetchUsersPushSubscriptions } = require('../../src/models/User');
    fetchUsersPushSubscriptions.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');
    const pushNotification = require('../../src/utils/PushNotification');

    await putUpdateJournalShareList(req, res);
    expect(updateJournalShareList).toHaveBeenCalledTimes(2);
    expect(updateJournalShareList).toHaveBeenLastCalledWith({
      journalId: 'journalId', readingId: 'readingId', shareList: [{ id: 1 }, { id: 2 }, { id: 4 }], userId: 'id'
    });
    expect(mockSendStatusFn).toHaveBeenLastCalledWith(200);
    expect(mockSendStatusFn).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(fetchUsersPushSubscriptions).toHaveBeenCalledTimes(2);
    expect(fetchUsersPushSubscriptions).toHaveBeenLastCalledWith([null, null, 4]);
    expect(pushNotification).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
  });

  test('updateJournalShareList with error', async () => {
    const mockEndFn = jest.fn();
    const mockSendStatusFn = jest.fn().mockReturnValue({ end: mockEndFn });
    const res = { sendStatus: mockSendStatusFn };
    const req = {
      body: {
        journalId: 'journalId', readingId: 'readingId', shareList: [{ id: 1 }, { id: 2 }, { id: 4 }], existedShareList: [1, 2, 3]
      },
    };
    const { updateJournalShareList } = require('../../src/models/Reading');
    const { fetchUsersPushSubscriptions } = require('../../src/models/User');
    updateJournalShareList.mockReturnValue(Promise.reject());
    fetchUsersPushSubscriptions.mockReturnValue(Promise.resolve());
    const { error } = require('../../src/utils/Logger');
    const pushNotification = require('../../src/utils/PushNotification');

    await putUpdateJournalShareList(req, res);
    expect(updateJournalShareList).toHaveBeenCalledTimes(3);
    expect(updateJournalShareList).toHaveBeenLastCalledWith({
      journalId: 'journalId', readingId: 'readingId', shareList: [{ id: 1 }, { id: 2 }, { id: 4 }], userId: 'id'
    });
    expect(mockSendStatusFn).toHaveBeenLastCalledWith(500);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(fetchUsersPushSubscriptions).toHaveBeenCalledTimes(3);
    expect(fetchUsersPushSubscriptions).toHaveBeenLastCalledWith([null, null, 4]);
    expect(pushNotification).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledTimes(2);
  });
});
