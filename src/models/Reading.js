const { ObjectId } = require('mongodb');
const logger = require('../utils/Logger');

const {
  promiseInsertResult, promiseFindResult, getDB, promiseReturnResult,
} = require('../MongoDBHelper');

const COLLECTION_READINGS = 'readings';
const COLLECTION_HEXAGRAMS = 'hexagrams';

/*  Delete a reading  */
exports.deleteReading = ({ readingId, userId }) => promiseInsertResult(db => db
  .collection(COLLECTION_READINGS).deleteOne({
    _id: new ObjectId(readingId),
    user_id: userId,
  }));

/** Fetching all reading list
  * @param {string} userId is the user id.
  * @return {object} Return an promise with fetching result.
 */
exports.fetchAllReadingList = ({ userId, pageNumber, numberPerpage }) => promiseFindResult(db => db
  .collection(COLLECTION_READINGS)
  .find({ user_id: userId }, { reading_name: 1, date: 1 })
  .skip(pageNumber * numberPerpage).limit(numberPerpage * 1)
  .sort({ date: -1 }));

/** Fetching journals from a reading
  * @param {object} queryObject contains query constrains for a reading.
  * @return {promise} return a promise with the joural information.
*/
exports.fetchJournalList = queryObject => promiseFindResult(db => {
  const query = { _id: new ObjectId(queryObject.readingId) };
  if (queryObject.userId) query.user_id = queryObject.userId;
  return db.collection(COLLECTION_READINGS).find(query, { journal_entries: 1 });
});

/** Getting the amount number of reading a user has.
  * @param {string} userId is the user's id.
  * @return {promise} Returning a promise object with the amount number of this user's reading.
*/
exports.fetchReadingsAmount = userId => promiseReturnResult(db => db
  .collection(COLLECTION_READINGS)
  .count({ user_id: userId }));

/* Getting readings by searching name */
exports.fetchReadingsBaseOnName = ({ user_id, keyWord }) => promiseFindResult(db => db
  .collection(COLLECTION_READINGS)
  .find({ user_id, reading_name: new RegExp(`.*${keyWord}.*`, 'i') }, { _id: 1, reading_name: 1 })
  .sort({ date: -1 })
  .limit(10));

/* ************  The code below is not tested since it will be refactored with Redux to improve the performence. ************** */
/* Working with method below to execute the callback function when all hexagram are fetched. */
const checkHexagramImageReadAndCallback = (checkNumber, targetNumber, callback, result) => {
  if (checkNumber === targetNumber) callback(result);
};

/** This method is using to find hexagram information for readings
  * @param {array} readings is an array that has reading objects.
  * @param {function} callback is a function will be transfered to anther function.
  * @return {null} No return.
 */
const findHexagramImages = (readings, callback) => {
  let checkNumber = 0;
  const targetNumber = readings.length * 2;
  // Making a copy for the readings. So, the code below is safe when change reading in the forEach function.
  const copyReadings = [...readings];
  copyReadings.forEach(reading => {
    getDB().collection(COLLECTION_HEXAGRAMS)
      .find({ img_arr: reading.hexagram_arr_1 }).next((err, imgInfo) => {
        reading.img1Info = imgInfo;
        checkNumber += 1;
        checkHexagramImageReadAndCallback(checkNumber, targetNumber, callback, copyReadings);
      });
    getDB().collection(COLLECTION_HEXAGRAMS)
      .find({ img_arr: reading.hexagram_arr_2 }).next((err, imgInfo) => {
        reading.img2Info = imgInfo;
        checkNumber += 1;
        checkHexagramImageReadAndCallback(checkNumber, targetNumber, callback, copyReadings);
      });
  });
};

// Have not been tested
/*  Get readings  */
exports.fetchRecentReadings = (pageNumber, numberPerpage, userId) => new Promise((resolve, reject) => {
  getDB().collection(COLLECTION_READINGS)
    .find(userId ? { user_id: userId } : {})
    .sort({ date: -1 })
    .limit(numberPerpage * 1)
    .skip(pageNumber * numberPerpage)
    .toArray((err, result) => {
      if (err) logger.error('Reading getRecentReadings something goes worry: ', err);
      if (result.length !== 0) findHexagramImages(result, backResult => resolve(backResult));
      else resolve(result);
    });
});

// Have not been tested
/*  Get readings by Hexagram's id  */
exports.fetchReadingsByHexagramId = (imageArray, userId) => new Promise((resolve, reject) => {
  const queryObject = { $or: [{ hexagram_arr_1: imageArray }, { hexagram_arr_2: imageArray }] };
  if (userId) queryObject.user_id = userId;
  getDB().collection(COLLECTION_READINGS).find(queryObject).toArray((err, result) => {
    if (result.length !== 0) findHexagramImages(result, callbackResult => resolve(callbackResult));
    else resolve(result);
  });
});
/* ************  The code above is not tested since it will be refactored with Redux to improve the performence. ************** */
