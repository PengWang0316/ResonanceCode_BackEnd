const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchUnattachedJournal } = require('../models/Journal');
const { fetchJournal } = require('../models/Reading');

module.exports = (req, res) => {
  const { jwtMessage, journalId, isUnattachedJournal } = req.query;
  const user = verifyJWT({ message: jwtMessage, res });
  const fetchPromise = isUnattachedJournal
    ? fetchUnattachedJournal({ journalId, userId: user._id })
    : fetchJournal({ journalId, userId: user._id });
  return fetchPromise.then(result => res.json(result)).catch(err => {
    logger.error('/journal', err);
    res.end();
  });
};
