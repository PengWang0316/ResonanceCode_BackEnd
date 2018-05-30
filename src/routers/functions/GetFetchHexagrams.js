const logger = require('../../utils/Logger');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.getHexagrams(req.query).then(result => res.json(result)).catch(err => logger.error('/fetchHexagrams', err));
