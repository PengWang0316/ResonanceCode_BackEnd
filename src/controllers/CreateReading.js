const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { createReading } = require('../models/Reading');
const { findHexagramImagesForReading } = require('../models/Hexagram');

module.exports = (req, res) => {
  const { jwtMessage, reading } = req.body;
  const user = verifyJWT({ message: jwtMessage, res });
  if (!user._id) return res.end('Invalid User.');
  reading.user_id = user._id;
  reading.date = new Date(reading.date);
  return createReading(reading)
    .then(result => findHexagramImagesForReading(result))
    .then(returnReading => res.json(returnReading))
    .catch(err => {
      logger.error('/reading', err);
      res.end();
    });
};
