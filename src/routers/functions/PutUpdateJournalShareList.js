const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

const pushNotification = require('../../utils/PushNotification');

module.exports = (req, res) => {
  const { _id } = verifyJWT({ message: req.body.jwtMessage, res });
  const {
    journalId, readingId, shareList, existedShareList
  } = req.body;
  mongodb.updateJournalShareList({
    journalId, readingId, shareList, userId: _id
  }).then(() => res.sendStatus(200).end()).catch(err => {
    logger.error('/updateJournalShareList', err);
    res.sendStatus(500).end();
  });
  // starting to push notification to new shared user.
  const newSharedUserIds = shareList.map(internalUser => {
    if (existedShareList.indexOf(internalUser.id) === -1) return internalUser.id;
    return null;
  });
  return mongodb.fetchUsersPushSubscriptions(newSharedUserIds).then(pushNotification).catch(err => logger.error('/updateJournalShareList', err));
};
