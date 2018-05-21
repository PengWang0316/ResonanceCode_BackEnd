const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.deleteJournal({
    journalId: req.body.journalId,
    readingIds: req.body.readingIds,
    userId: verifyJWT({ message: req.body.jwtMessage, res })._id
  }).then(_ => res.sendStatus(200).end()).catch(err => logger.error(err));
