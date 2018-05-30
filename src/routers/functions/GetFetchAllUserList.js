const logger = require('../../utils/Logger');
const mongodb = require('../../MongoDB');

module.exports = ({ query }, { json }) =>
  mongodb.fetchAllUserList(query).then(result => json(result)).catch(err => logger.error('/fetchAllUserList', err));
