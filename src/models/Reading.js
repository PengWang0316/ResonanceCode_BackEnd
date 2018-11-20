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

/**
 * Get one journal
 * @param {object} object contains journalId and userId
 * @return {promise} return a promise
 */
exports.fetchJournal = ({ journalId, userId }) => new Promise((resolve, reject) => {
  getDB().collection(COLLECTION_READINGS).find({ user_id: userId, 'journal_entries._id': new ObjectId(journalId) }, {
    _id: 1, reading_name: 1, user_id: 1, journal_entries: 1,
  }).toArray((err, result) => {
    // Getting all reading ids
    if (err) reject(err);
    const readingIds = {};
    // let readingNames = [];
    result.forEach((reading) => {
      readingIds[reading._id] = reading.reading_name;
    });
    // Finding the right journal and attaching the reading ids array to it.
    result[0].journal_entries.forEach(element => {
      if (element._id.toString() === journalId) resolve({
        user_id: userId, readingIds, ...element,
      });
    });
  });
});

/** Fetch a journal based on both journal and reading's id
  * @param {object} the param object contains journal's id, reading's id, and user's id.
  * @return {Promise} Return a promise to the caller.
*/
exports.fetchJournalBasedOnReadingJournal = ({
  journalId, readingId, userId,
}) => new Promise((resolve, reject) => getDB()
  .collection(COLLECTION_READINGS)
  .findOne({ _id: new ObjectId(readingId), user_id: userId }, { journal_entries: 1 })
  .then((result, err) => {
    if (err) reject(err);
    else result.journal_entries.forEach(journal => {
      if (journal._id.toString() === journalId) resolve(journal);
    });
  }));


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
