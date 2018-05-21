const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  return mongodb.fetchJournalBasedOnReadingJournal({
    readingId: req.query.readingId, journalId: req.query.journalId, userId: user._id
  }).then(result => res.json(result)).catch(err => logger.error('/journalBasedOnJournalReading', err));
};
