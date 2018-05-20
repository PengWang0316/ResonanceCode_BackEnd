const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  return mongodb.getUnattachedJournalList(user._id).then(result => {
    res.json(result.sort((previous, next) =>
      new Date(next.date).getTime() - new Date(previous.date).getTime()));
  }).catch(err => logger.error('fetchUnattachedJournals', err));
};
