const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchRecentReadings } = require('../models/Reading');
require('dotenv').config(); // Loading .env to process.env

const { ADMINISTRATOR_ROLE } = process.env;

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  if (!user._id || !user.role) {
    res.end('Invalid User.');
    return null;
  }
  return fetchRecentReadings(
    req.query.pageNumber,
    req.query.numberPerpage,
    user.role * 1 === ADMINISTRATOR_ROLE * 1 ? null : user._id,
  ).then(result => res.json(result))
    .catch(err => {
      logger.error('/fetchReadings', err);
      res.end();
    });
};
