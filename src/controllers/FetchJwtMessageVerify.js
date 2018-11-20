const logger = require('../utils/Logger');
const verifyJWT = require('../utils/VerifyJWT');
const { fetchOneUser } = require('../models/User');


module.exports = (req, res) => fetchOneUser(verifyJWT({ message: req.query.jwtMessage, res })._id)
  .then(result => {
    const returnUser = { ...result, isAuth: true };
    delete returnUser.password;
    res.json(returnUser);
  })
  .catch(err => {
    logger.error('/jwtMessageVerify', err);
    res.end();
  });
