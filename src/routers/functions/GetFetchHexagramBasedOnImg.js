const logger = require('../../utils/Logger');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.fetchHexagram(req.query.imgArray)
    .then(result => res.json(result)).catch(err => logger.error('/fetchHexagramBasedOnImg', err));
