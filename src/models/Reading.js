const { ObjectId } = require('mongodb');

const { promiseInsertResult, promiseFindResult } = require('../MongoDBHelper');

const COLLECTION_READINGS = 'readings';

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
