const mongodb = require('mongodb');

const { MongoClient } = mongodb;
const logger = require('./utils/Logger');

require('dotenv').config();
// Loading .env to process.env
const DB_URL = process.env.DB_HOST;
// const COLLECTION_USER = 'users';
// const COLLECTION_BASIC_INFORMATION = 'BasicInformation';
// const COLLECTION_MENUS = 'Menus';
// const COLLECTION_ORDERS = 'orders';

const { DB_NAME } = process.env;
let dbs;

// Initializing the connection pool.
const ininitalConnects = async () => {
  try {
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, poolSize: 10 });
    dbs = client.db(DB_NAME);
  } catch (e) {
    logger.error('Unable to connect to the mongoDB server. Error:', e);
  }
};

ininitalConnects();

exports.getDB = () => dbs;

/* Using Promise to wrap connection and toArray */
exports.promiseFindResult = callback => new Promise((resolve, reject) => callback(dbs)
  .toArray((err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));

exports.promiseNextResult = callback => new Promise((resolve, reject) => callback(dbs)
  .next((err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));

exports.promiseInsertResult = callback => new Promise((resolve, reject) => callback(dbs)
  .then(result => resolve()));

exports.promiseReturnResult = callback => new Promise((resolve, reject) => resolve(callback(dbs)));
