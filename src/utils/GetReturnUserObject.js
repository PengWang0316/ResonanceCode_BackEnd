const jwt = require('jsonwebtoken');

require('dotenv').config(); // Loading .env to process.env

const { NORMAL_ROLE } = process.env;

/** Get information from database's return and sign the user Object with jwt.
  * @param {object} user comes from database.
  * @return {object} return an object that contains jwt message and formated user object.
*/
module.exports = user => {
  const returnUser = Object.assign({
    isAuth: true, role: user.role || NORMAL_ROLE * 1
  }, user);
  return { jwt: jwt.sign(returnUser, process.env.JWT_SECERT), user: returnUser };
};
