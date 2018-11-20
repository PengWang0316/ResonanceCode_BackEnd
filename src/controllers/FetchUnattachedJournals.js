const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchUnattachedJournalList } = require('../models/Journal');

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  return fetchUnattachedJournalList(user._id).then(result => {
    res.json(result
      .sort((previous, next) => new Date(next.date).getTime() - new Date(previous.date).getTime()));
  }).catch(err => {
    logger.error('/fetchUnattachedJournals', err);
    res.end();
  });
};
