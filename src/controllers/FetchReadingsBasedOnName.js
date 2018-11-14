const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchReadingsBaseOnName } = require('../models/Reading');

module.exports = (req, res) => fetchReadingsBaseOnName({
  user_id: verifyJWT({ message: req.query.jwtMessage, res })._id,
  keyWord: req.query.keyWord,
}).then(result => res.json(result))
  .catch(err => {
    logger.error('/fetchReadingsBasedOnName', err);
    res.end();
  });
