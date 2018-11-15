const { promiseFindResult, promiseReturnResult, promiseNextResult } = require('../MongoDBHelper');

const COLLECTION_USER = 'users';

/**
  * Fetching all user's name as a list.
  * @param {object} An object that contains pageNumber as current page the user wants to get and numberPerpage as how many users' name the user wants to see in a same page.
  * @return {promise} Returning a promise with user objects that have displayName, photo, and _id field.
*/
exports.fetchAllUserList = ({ pageNumber, numberPerpage }) => promiseFindResult(db => db
  .collection(COLLECTION_USER).find({}, {
    displayName: 1, photo: 1, role: 1, 'settings.customName': 1,
  }).skip(pageNumber * numberPerpage).limit(numberPerpage * 1));

/**
  * Getting the amount number of all user.
  * @return {promise} Returning a promise object with the amount number of this user's reading.
*/
exports.fetchUsersAmount = () => promiseReturnResult(db => db
  .collection(COLLECTION_USER)
  .count({}));

/**
  * Fetching a user based on the username.
  * @param {object} query is an object that contains username.
  * @return {Promise} return a promise with the fetching result.
 */
exports.isUserNameAvailable = query => promiseNextResult(db => db
  .collection(COLLECTION_USER).find({ username: query.userName }));

// new Promise((resolve, reject) => connectToDb(db => db.collection(COLLECTION_USER).find({ username: query.userName }).next((err, result) => resolve(!result))));
