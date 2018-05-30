const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.fetchAllReadingList({
    userId: verifyJWT({ message: req.query.jwt, res })._id,
    pageNumber: req.query.pageNumber,
    numberPerpage: req.query.numberPerpage
  }).then(result => res.json(result)).catch(err => logger.error('/fetchAllReadingList', err));
