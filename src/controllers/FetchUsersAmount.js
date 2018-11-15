const logger = require('../utils/Logger');
const { fetchUsersAmount } = require('../models/User');

module.exports = (req, res) => fetchUsersAmount().then(result => res.json(result))
  .catch(err => {
    logger.error('/fetchUsersAmount', err);
    res.end();
  });
