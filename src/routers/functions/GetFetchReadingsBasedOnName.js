const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.fetchReadingsBaseOnName({
    user_id: verifyJWT({ message: req.query.jwtMessage, res })._id,
    keyWord: req.query.keyWord
  }).then(result => res.json(result)).catch(err => logger.error(err));
