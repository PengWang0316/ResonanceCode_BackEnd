const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const mongodb = require('../MongoDB');

/* TODO Separate the updateJournal functiont to models */
module.exports = (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  return mongodb.updateJournal(Object.assign({ user_id: user._id }, req.body.journal))
    .then(() => res.sendStatus(200).end()).catch(err => logger.error('/journal', err));
};
