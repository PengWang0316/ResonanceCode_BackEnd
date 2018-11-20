const logger = require('../utils/Logger');
const { fetchAllUserList } = require('../models/User');

module.exports = ({ query }, { json, end }) => fetchAllUserList(query)
  .then(result => json(result))
  .catch(err => {
    logger.error('/fetchAllUserList', err);
    end();
  });
