const logger = require('../utils/Logger');
const { isUserNameAvailable } = require('../models/User');

module.exports = (req, res) => isUserNameAvailable(req.query)
  .then(result => res.send(!result))
  .catch(err => {
    logger.error('/isUserNameAvailable', err);
    res.end();
  });
