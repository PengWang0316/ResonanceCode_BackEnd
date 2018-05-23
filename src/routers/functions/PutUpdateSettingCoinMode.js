const logger = require('../../utils/Logger');
const verifyJWT = require('../../utils/VerifyJWT');
const mongodb = require('../../MongoDB');
const getReturnUserObject = require('../../utils/GetReturnUserObject');

module.exports = (req, res) =>
  mongodb.updateUser(verifyJWT({ message: req.body.jwtMessage, res })._id, { 'settings.coinMode': req.body.coinMode })
    .then(result => res.json(getReturnUserObject(result.value))).catch(err => logger.error(err));
