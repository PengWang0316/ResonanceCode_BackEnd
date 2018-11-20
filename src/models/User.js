const { ObjectId } = require('mongodb');

const {
  promiseFindResult, promiseReturnResult, promiseNextResult, getDB,
} = require('../MongoDBHelper');

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

exports.fetchOneUser = userId => new Promise((reslove, reject) => getDB()
  .collection(COLLECTION_USER)
  .findOne({ _id: new ObjectId(userId) }, {
    pushSubscriptions: 0, facebookId: 0, googleId: 0, email: 0,
  }).then((result, err) => {
    if (err) reject(err);
    reslove(result);
  }));

/** Fetching user's PushSubscriptions
  * @param {array} userIds is an array that contains users' ids.
  * @return {promise} Return a promise with users' information (just pushSubscription include).
*/
exports.fetchUsersPushSubscriptions = userIds => promiseFindResult(db => {
  const userIdsObject = userIds.map(id => new ObjectId(id));
  return db.collection(COLLECTION_USER)
    .find({ _id: { $in: userIdsObject }, 'settings.isPushNotification': true }, { _id: 0, pushSubscriptions: 1 });
});

/** Update a user's information.
  * @param {string} userId is the id of a user.
  * @param {object} user is the object that contains the new information of the use.
  * @param {object} removeFields is an object that contains the fields will be removed from the database.
  * @returns {Promise} Return a promise object with new user information.
*/
exports.updateUser = (userId, user, removeFields) => promiseReturnResult(db => db
  .collection(COLLECTION_USER)
  .findOneAndUpdate(
    { _id: new ObjectId(userId) },
    removeFields ? { $set: user, $unset: removeFields } : { $set: user },
    { returnOriginal: false, projection: { pushSubscription: 0 } },
  ));

// new Promise((resolve, reject) => connectToDb(db => db.collection(COLLECTION_USER).find({ username: query.userName }).next((err, result) => resolve(!result))));
