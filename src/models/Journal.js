const { ObjectId } = require('mongodb');

const { promiseInsertResult, promiseNextResult, promiseFindResult } = require('../MongoDBHelper');

const COLLECTION_JOURNAL_ENTRIES = 'journal_entries';

/*  Delete one unattached journal  */
exports.deleteUnattachedJournal = ({ journalId, userId }) => promiseInsertResult(db => db
  .collection(COLLECTION_JOURNAL_ENTRIES)
  .deleteOne({ _id: new ObjectId(journalId), user_id: userId }));

/*  Get one unattached journal  */
exports.fetchUnattachedJournal = ({ journalId, userId }) => promiseNextResult(db => db
  .collection(COLLECTION_JOURNAL_ENTRIES)
  .find({ _id: new ObjectId(journalId), user_id: userId }));

/* Get unattached journal list */
exports.fetchUnattachedJournalList = userId => promiseFindResult(db => db
  .collection(COLLECTION_JOURNAL_ENTRIES)
  .find({ user_id: userId }));

/*  Create a new journal  */
exports.createJournal = journal => promiseInsertResult(db => {
  const internalJournal = { ...journal }; // Using a copy to work.
  internalJournal.date = new Date(internalJournal.date);
  internalJournal._id = new ObjectId();
  delete internalJournal.readings;
  return db.collection(COLLECTION_JOURNAL_ENTRIES).insert(internalJournal);
});
