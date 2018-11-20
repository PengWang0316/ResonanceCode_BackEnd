const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { deleteJournal } = require('../models/Reading');

module.exports = (req, res) => deleteJournal({
  journalId: req.body.journalId,
  readingIds: req.body.readingIds,
  userId: verifyJWT({ message: req.body.jwtMessage, res })._id,
}).then(_ => res.sendStatus(200).end())
  .catch(err => {
    logger.error('/deleteJournal', err);
    res.end();
  });
