const { ObjectId } = require('mongodb');

const { promiseInsertResult } = require('../MongoDBHelper');

const COLLECTION_READINGS = 'readings';

/*  Delete a reading  */
exports.deleteReading = ({ readingId, userId }) => promiseInsertResult(db => db
  .collection(COLLECTION_READINGS).deleteOne({
    _id: new ObjectId(readingId),
    user_id: userId,
  }));
