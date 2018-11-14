const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchReadingsByHexagramId } = require('../models/Reading');
require('dotenv').config(); // Loading .env to process.env

const { ADMINISTRATOR_ROLE } = process.env;
module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  return fetchReadingsByHexagramId(
    req.query.imageArray,
    user.role * 1 === ADMINISTRATOR_ROLE * 1 ? null : user._id,
  ).then(result => res.json(result))
    .catch(err => {
      logger.error('/fetchReadingsBasedOnHexagram', err);
      res.end();
    });
};
