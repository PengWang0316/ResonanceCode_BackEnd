const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchJournalList } = require('../models/Reading');
require('dotenv').config(); // Loading .env to process.env

const { ADMINISTRATOR_ROLE } = process.env;

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  const queryObject = {
    readingId: req.query.readingId,
    userId: user.role * 1 === ADMINISTRATOR_ROLE * 1 ? null : user._id,
  };
  return fetchJournalList(queryObject)
    .then(result => res.json(result[0].journal_entries
      .sort((previous, next) => new Date(next.date).getTime() - new Date(previous.date).getTime())))
    .catch(err => {
      logger.error('/fetchJournals', err);
      res.end();
    });
};
