const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { deleteReading } = require('../models/Reading');

module.exports = (req, res) => deleteReading({
  readingId: req.query.readingId,
  userId: verifyJWT({ message: req.query.jwtMessage, res })._id,
}).then(() => res.sendStatus(200).end()).catch(err => {
  logger.error('/deleteReading', err);
  res.end();
});
