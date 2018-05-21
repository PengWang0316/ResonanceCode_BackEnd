const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');
require('dotenv').config(); // Loading .env to process.env

const { ADMINISTRATOR_ROLE } = process.env;

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  if (user.role === ADMINISTRATOR_ROLE * 1)
    return mongodb.getHexagrams({})
      .then(result => res.json(result)).catch(err => logger.error(err));
  res.status(401).end('Unauthenticated User');
  return null;
};
