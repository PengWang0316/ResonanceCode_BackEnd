const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchReadingsAmount } = require('../models/Reading');

module.exports = (req, res) => fetchReadingsAmount(verifyJWT({
  message: req.query.jwtMessage, res,
})._id).then(result => res.json(result))
  .catch(err => {
    logger.error('/fetchReadingsAmount', err);
    res.end();
  });
