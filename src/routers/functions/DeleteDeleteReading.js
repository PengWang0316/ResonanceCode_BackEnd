const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.deleteReading({
    readingId: req.query.readingId,
    userId: verifyJWT({ message: req.query.jwtMessage, res })._id
  }).then(_ => res.sendStatus(200).end()).catch(err => logger.error('/deleteReading', err));
