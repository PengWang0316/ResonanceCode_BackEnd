const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  const { jwtMessage, journalId, isUnattachedJournal } = req.query;
  const user = verifyJWT({ message: jwtMessage, res });
  const fetchPromise = isUnattachedJournal ?
    mongodb.fetchUnattachedJournal({ journalId, userId: user._id }) :
    mongodb.fetchJournal({ journalId, userId: user._id });
  return fetchPromise.then(result => res.json(result)).catch(err => logger.error('/journal', err));
};
