const { ObjectId } = require('mongodb');

const { promiseInsertResult } = require('../MongoDBHelper');

const COLLECTION_JOURNAL_ENTRIES = 'journal_entries';

/*  Delete one unattached journal  */
exports.deleteUnattachedJournal = ({ journalId, userId }) => promiseInsertResult(db => db
  .collection(COLLECTION_JOURNAL_ENTRIES)
  .deleteOne({ _id: new ObjectId(journalId), user_id: userId }));