const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.fetchReadingsAmount(verifyJWT({ message: req.query.jwtMessage, res })._id)
    .then(result => res.json(result)).catch(err => logger.error(err));
