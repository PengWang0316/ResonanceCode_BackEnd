const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { searchReadings } = require('../models/Reading');
require('dotenv').config(); // Loading .env to process.env

const { ADMINISTRATOR_ROLE } = process.env;
module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  const queryObject = JSON.parse(req.query.searchCriterias);
  // logger.error(user);
  if (user.role * 1 !== ADMINISTRATOR_ROLE * 1) queryObject.userId = user._id;
  return searchReadings(queryObject)
    .then(result => res.json(result)).catch(err => {
      logger.error('/searchReadings', err);
      res.end();
    });
};
