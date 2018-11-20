const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { updateHexagram } = require('../models/Hexagram');
require('dotenv').config(); // Loading .env to process.env

const { ADMINISTRATOR_ROLE } = process.env;

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  if (user.role !== ADMINISTRATOR_ROLE * 1) return res.end('Invalidated user');
  return updateHexagram(req.body.hexagram)
    .then(_ => res.sendStatus(200).end())
    .catch(err => {
      logger.error('/hexagram', err);
      res.end();
    });
};
