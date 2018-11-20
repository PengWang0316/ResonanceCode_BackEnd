const logger = require('../utils/Logger');
const { fetchHexagrams } = require('../models/Hexagram');

module.exports = (req, res) => fetchHexagrams(req.query)
  .then(result => res.json(result))
  .catch(err => {
    logger.error('/fetchHexagrams', err);
    res.end();
  });
