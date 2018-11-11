const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchHexagrams } = require('../models/Hexagram');
require('dotenv').config(); // Loading .env to process.env

const { ADMINISTRATOR_ROLE } = process.env;
module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  if (user.role === ADMINISTRATOR_ROLE * 1) return fetchHexagrams({})
    .then(result => res.json(result)).catch(err => {
      logger.error('/fetchAllHexagrams', err);
      res.end();
      return null;
    });
  res.status(401).end('Unauthenticated User');
  return null;
};
