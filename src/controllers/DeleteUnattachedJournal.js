const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { deleteUnattachedJournal } = require('../models/Journal');

module.exports = (req, res) => deleteUnattachedJournal({
  journalId: req.query.journalId,
  userId: verifyJWT({ message: req.query.jwtMessage, res })._id,
}).then(_ => res.sendStatus(200).end()).catch(err => {
  logger.error('/deleteUnattachedJournal', err);
  res.end();
});
