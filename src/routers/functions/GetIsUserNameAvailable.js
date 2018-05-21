const logger = require('../../utils/Logger');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.isUserNameAvailable(req.query)
    .then(result => res.send(result)).catch(err => logger.error(err));
