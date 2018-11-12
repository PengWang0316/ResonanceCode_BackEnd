const { ObjectId } = require('mongodb');

const { promiseFindResult, promiseNextResult } = require('../MongoDBHelper');

const COLLECTION_HEXAGRAMS = 'hexagrams';

/** working with method below in order to transfer the query object to the correct format.
  * @param {object} query is an object that contains the filter information for the Hexagram.
  * @returns {object} Return the query object that can be used in the database.
*/
function getHexagramsQueryObject(query) {
  const queryObject = {};
  if (query.upperId && query.upperId !== '0') queryObject.upper_trigrams_id = new ObjectId(query.upperId);
  if (query.lowerId && query.lowerId !== '0') queryObject.lower_trigrams_id = new ObjectId(query.lowerId);
  if (query.line13Id && query.line13Id !== '0') queryObject.line_13_id = new ObjectId(query.line13Id);
  if (query.line25Id && query.line25Id !== '0') queryObject.line_25_id = new ObjectId(query.line25Id);
  if (query.line46Id && query.line46Id !== '0') queryObject.line_46_id = new ObjectId(query.line46Id);
  return queryObject;
}

/*  fetch hexagrams  */
exports.fetchHexagrams = query => promiseFindResult(db => db.collection(COLLECTION_HEXAGRAMS)
  .find(getHexagramsQueryObject(query)));

/*  Fetching hexagram based on the image arr */
exports.fetchHexagramBasedOnImgArr = imgArray => promiseNextResult(db => db.collection(COLLECTION_HEXAGRAMS).find({ img_arr: imgArray }));
