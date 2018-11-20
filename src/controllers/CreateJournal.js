const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { createJournal } = require('../models/Reading');
const Journal = require('../models/Journal');

module.exports = (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  const journal = { user_id: user._id, ...req.body.journal };

  return Object.keys(journal.readings).length === 0
    ? Journal.createJournal(journal).then(() => res.sendStatus(200).end())
      .catch(err => {
        logger.error('/postJournal', err);
        res.end();
      })
    : createJournal(journal).then(() => res.sendStatus(200).end())
      .catch(err => {
        logger.error('/postJournal', err);
        res.end();
      });
};
