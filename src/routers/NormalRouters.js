const jwt = require('jsonwebtoken'); // May need to be deleted

const normalRouter = require('express').Router();
// const winston = require('winston');  Moved out to the utils
const webpush = require('web-push');
const pdfmake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
const cloudinary = require('cloudinary');

const getDateString = require('../Util').getDateString;
const verifyJWT = require('../utils/VerifyJWT');
const logger = require('../utils/Logger');

pdfmake.vfs = pdfFonts.pdfMake.vfs; // Setting the default font for pdfMake libaray.

require('dotenv').config(); // Loading .env to process.env
// const USERNAME = 'resonancecode_webuser';
// const PASSWORD = 'cyJz2b4vGb3EgHRf0Khq'; // username
const { ADMINISTRATOR_ROLE, ADVANCE_ROLE, NORMAL_ROLE } = process.env;
const mongodb = require('../MongoDB');

// Functions import
const getJwtMessageVerify = require('./functions/GetJwtMessageVerify');
const postReading = require('./functions/PostReading');
const postJournal = require('./functions/PostJournal');
const putJournal = require('./functions/PutJournal');
const putHexagram = require('./functions/PutHexagram');
const getFetchReadings = require('./functions/GetFetchReadings');
const getFetchJournals = require('./functions/GetFetchJournals');
const getFetchUnattchedJournals = require('./functions/GetUnattachedJournals');
// API_BASE_URL = "/"; Deprecated
// const axios = require('axios');
// const querystring = require('querystring');


cloudinary.config({ // confige the cloudinary library.
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/** Setting up webpush */
// webpush.setGCMAPIKey('AIzaSyAdrj0b93pqqtwj0vpocMQgqajgbCeTqaw');
// webpush.setVapidDetails(
//   'https://kairoscope.resonance-code.com',
//   process.env.APPLICATION_SERVER_PUBLIC_KEY,
//   process.env.APPLICATION_SERVER_PRIVATE_KEY
// );

// /*********  index page  ************/
// normalRouter.get("/",function(req,res){
//   res.sendFile(path.resolve(__dirname+"/dist/index.html"));
// });

/* Checking jwt token */
normalRouter.get('/jwtMessageVerify', getJwtMessageVerify);

/** ********************  Create a new reading  *************************** */
normalRouter.post('/reading', postReading);

/** ********************  Create a new journal  *************************** */
normalRouter.post('/journal', postJournal);

/** ******************** Update a journal  *************************** */
normalRouter.put('/journal', putJournal);

/** ******************** Update a hexagram  *************************** */
normalRouter.put('/hexagram', putHexagram);

/** fetch readings */
normalRouter.get('/fetchReadings', getFetchReadings);

/* Getting journals list */
normalRouter.get('/fetchJournals', getFetchJournals);

/** Getting unattached journals list */
normalRouter.get('/fetchUnattachedJournals', getFetchUnattchedJournals);

/** *************  Getting one journal  ******************** */
normalRouter.get('/journal', (req, res) => {
  const { jwtMessage, journalId, isUnattachedJournal } = req.query;
  const user = verifyJWT({ message: jwtMessage, res });
  if (isUnattachedJournal)
    mongodb.fetchUnattachedJournal({ journalId, userId: user._id })
      .then(result => res.json(result));
  else
    mongodb.fetchJournal({ journalId, userId: user._id }).then(result => res.json(result));
});

/** Fetch a journal based on both reading and journal's id */
normalRouter.get('/journalBasedOnJournalReading', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.fetchJournalBasedOnReadingJournal({
    readingId: req.query.readingId, journalId: req.query.journalId, userId: user._id
  }).then(result => res.json(result)).catch(err => logger.error('/journalBasedOnJournalReading', err));
});

/** *************  Getting hexagrams  ******************** */
normalRouter.get('/fetchHexagrams', (req, res) => {
  mongodb.getHexagrams(req.query).then(result => res.json(result));
});

/** *************  Getting all hexagrams  ******************** */
normalRouter.get('/fetchAllHexagrams', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  if (user.role === ADMINISTRATOR_ROLE)
    mongodb.getHexagrams({}).then(result => res.json(result));
  else res.status(401).end('Unauthenticated User');
});

/** Fetching one hexagram */
normalRouter.get('/fetchHexagramBasedOnImg', (req, res) => {
  mongodb.fetchHexagram(req.query.imgArray).then(result => res.json(result));
});

/** *************  Getting readings by hexagram's id  ******************** */
normalRouter.get('/fetchReadingsBaseOnHexagram', (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  mongodb.getReadingsByHexagramId(
    req.query.imageArray,
    user.role * 1 === ADMINISTRATOR_ROLE ? null : user._id, result => res.json(result)
  );
});

/** *********  Fetching readings by searching criterias ************ */
normalRouter.get('/searchReadings', (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  const queryObject = JSON.parse(req.query.searchCriterias);
  // logger.error(user);
  if (user.role * 1 !== ADMINISTRATOR_ROLE) queryObject.userId = user._id;
  mongodb.getSearchReadings(queryObject, result => res.json(result));
});

/** Fetching the reading list */
normalRouter.get('/fetchAllReadingList', (req, res) => {
  const user = verifyJWT({ message: req.query.jwt, res });
  mongodb.fetchAllReadingList({
    userId: user._id, pageNumber: req.query.pageNumber, numberPerpage: req.query.numberPerpage
  }).then(result => res.json(result));
});

/** ****************  Getting reading by searching name   ********************* */
normalRouter.get('/fetchReadingsBasedOnName', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.fetchReadingsBaseOnName({ user_id: user._id, keyWord: req.query.keyWord })
    .then(result => res.json(result));
});

/** ***************  Delete reading  ***************************** */
normalRouter.delete('/deleteReading', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.deleteReading({ readingId: req.query.readingId, userId: user._id })
    .then(_ => res.sendStatus(200).end());
});

/** *****************  Delete one journal   ************************ */
normalRouter.post('/deleteJournal', (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  mongodb.deleteJournal({
    journalId: req.body.journalId,
    readingIds: req.body.readingIds,
    userId: user._id
  }).then(_ => res.sendStatus(200).end());
});

/** Delete one unattached journal */
normalRouter.delete('/deleteUnAttachedJournal', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.deleteUnattachedJournal({ journalId: req.query.journalId, userId: user._id })
    .then(_ => res.end());
});

/** Check whether user name is available */
normalRouter.get('/isUserNameAvailable', (req, res) => {
  mongodb.isUserNameAvailable(req.query, result => {
    // logger.error(result);
    res.send(result);
  });
});

/** Get information from database's return and sign the user Object with jwt.
  * @param {object} user comes from database.
  * @return {object} return an object that contains jwt message and formated user object.
*/
const getReturnUserObject = user => {
  const returnUser = Object.assign({
    isAuth: true, role: user.role || NORMAL_ROLE
  }, user);
  return { jwt: jwt.sign(returnUser, process.env.JWT_SECERT), user: returnUser };
};

/** Changing a user's default hexagram choosing mode.
  * After update the database, resign the jwt and send back the user object for redux and jwtMessage to localstorage.
*/
normalRouter.put('/updateSettingCoinMode', (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  mongodb.updateUser(user._id, { 'settings.coinMode': req.body.coinMode })
    .then(result => res.json(getReturnUserObject(result.value)));
});

/* Fetch how many reading a user has */
normalRouter.get('/fetchReadingsAmount', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.fetchReadingsAmount(user._id).then(result => res.json(result));
});

/* Fetch the total number of users */
normalRouter.get('/fetchUsersAmount', (req, res) => {
  mongodb.fetchUsersAmount().then(result => res.json(result));
});

/* Fetch user names based on the page number */
normalRouter.get('/fetchAllUserList', (req, res) => {
  mongodb.fetchAllUserList(req.query).then(result => res.json(result)).catch(err => logger.error('/fetchAllUserList', err));
});

/* Updating the share list for a reading's journal. */
normalRouter.put('/updateJournalShareList', (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  const {
    journalId, readingId, shareList, existedShareList
  } = req.body;
  mongodb.updateJournalShareList({
    journalId, readingId, shareList, userId: user._id
  });
  res.sendStatus(200).end();
  // starting to push notification to new shared user.
  const newSharedUserIds = shareList.map(internalUser => {
    if (existedShareList.indexOf(internalUser.id) === -1) return internalUser.id;
    return null;
  });
  mongodb.fetchUsersPushSubscriptions(newSharedUserIds).then(users => {
    const notificatioOptions = {
      vapidDetails: {
        subject: 'https://kairoscope.resonance-code.com',
        publicKey: process.env.APPLICATION_SERVER_PUBLIC_KEY,
        privateKey: process.env.APPLICATION_SERVER_PRIVATE_KEY
      }
    };
    let promiseChain = Promise.resolve();
    users.forEach(eachUser => {
      promiseChain = promiseChain.then(() =>
        Object.keys(eachUser.pushSubscriptions).forEach(key => webpush.sendNotification(eachUser.pushSubscriptions[key], 'Someone shared a reading to you. Click to view it.', notificatioOptions).catch(err => logger.error('existedShareList push notification error: statusCode: ', err.statusCode, 'error: ', err))));
    });
  });
});

const eliminateUnnecessaryJournal = ({ readings, userId }) => {
  // const newReadings = { ...readings };
  const newReadings = readings.map(reading => {
    const newReading = Object.assign({}, reading);
    newReading.journal_entries = newReading.journal_entries.filter(journal => {
      let isReturn = false;
      if (journal.shareList)
        journal.shareList.forEach(shareInfo => { if (shareInfo.id === userId) isReturn = true; });
      return isReturn;
    });
    return newReading;
  });
  return newReadings;
};

/* Fetching the shared readings for the user. */
normalRouter.get('/fetchSharedReadings', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.fetchSharedReadings({
    userId: user._id,
    pageNumber: req.query.pageNumber,
    numberPerpage: req.query.numberPerpage
  }).then(result => {
    if (result.length === 0) res.json(result);
    else res.json(eliminateUnnecessaryJournal({ readings: result, userId: user._id }));
  }).catch(err => logger.error('/fetchSharedReadings', err));
});

/* Fetching the total amount of shared readings a user has. */
normalRouter.get('/fetchSharedReadingsAmount', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.fetchSharedReadingsAmount(user._id).then(result => res.json(result)).catch(err => logger.error('/fetchSharedReadingsAmount', err));
});

/** Eliminating the duplicated journal and sort them based on create date.
  * @param {array} readings is an array that contains reading with journalEntry information.
  * @return {array} Returning a array that contains all journal the user has.
*/
const sortAndEliminateJournals = readings => {
  const allJournalObject = {}; // Initializing a journal object.
  readings.forEach(reading => reading.journal_entries.forEach(journal => {
    allJournalObject[journal._id] = journal; // Putting all journal to the array. (Eliminating process)
  }));
  // Put all journal to an array and sort it based on date field.
  return Object.keys(allJournalObject)
    .map(key => allJournalObject[key])
    .sort((previous, next) => next.date - previous.date);
};

/* Fetching all journal a user has. */
normalRouter.get('/fetchAllJournal', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  mongodb.fetctAllReadingWithJournalEntry(user._id).then(result => res.json(sortAndEliminateJournals(result))).catch(err => logger.error('/fetchAllJournal', err));
});

/* Saving the push subscription information to the user account. */
normalRouter.put('/savePushSubscription', (req, res) => {
  const { jwtMessage, pushSubscription } = req.body;
  const user = verifyJWT({ message: jwtMessage, res });
  // const updatePushSubscription = { 'settings.isPushNotification': true };
  // updatePushSubscription[`pushSubscriptions.${pushSubscription.keys.auth}`] = pushSubscription;
  mongodb.updateUser(user._id, { [`pushSubscriptions.${pushSubscription.keys.auth}`]: pushSubscription, 'settings.isPushNotification': true })
    .then(result => res.json(getReturnUserObject(result.value)))
    .catch(err => logger.error('/savePushSubscription', err));
});

/* Setting the isPushNotification as false in the user account. */
normalRouter.put('/turnOffPushSubscription', (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  mongodb.updateUser(user._id, { 'settings.isPushNotification': false })
    .then(result => res.json(getReturnUserObject(result.value)))
    .catch(err => logger.error('/turnOffPushSubscription', err));
});

/** Assemble the docDefinition for the pdfmake.
  * @param {object} the param includes readingDataUrl (the reading's dataurl that comes from html2canvas) and a journal array that comes from database.
  * @return {object} Return the object that will be used by pdfmake library.
*/
const getPdfDocDefinition = ({ readingDataUrl, journals, readingId }) => {
  const pdfDocDefinition = {
    pageMargins: [30, 40, 30, 40],
    header: {
      columns: [{
        text: 'Generated by kairoScope (kairoscope.resonance-code.com)', alignment: 'right', margin: [0, 12, 10, 0], fontSize: 9
      }]
    },
    content: [
      { image: readingDataUrl, width: 550 }
    ]
  };
  const keyExpression = /(.*)-\d+$/; // Using this to pick up the content field
  // Start to pull out all journal
  if (journals) journals.forEach((journal, index) => {
    pdfDocDefinition.content.push({
      text: `Journal ${index + 1}    ${getDateString(journal.date)}`, fontSize: 14, bold: true, margin: [0, 19, 0, 3]
    });
    pdfDocDefinition.content.push({
      text: `Phase of dialogue: ${journal.pingPongStates[readingId]}`, fontSize: 9
    });
    const journalContentKeys = Object.keys(journal);
    let isEmpty = true;
    journalContentKeys.forEach(key => {
      const result = key.match(keyExpression);
      if (result) {
        pdfDocDefinition.content.push({
          text: `${result[1].replace('_', ' ')}:`, fontSize: 12, bold: true, margin: [0, 18, 0, 8]
        });
        pdfDocDefinition.content.push({ text: `${journal[result[0]]}`, fontSize: 10 });
        isEmpty = false;
      }
    });
    if (isEmpty) pdfDocDefinition.content.push({ text: 'No content.', fontSize: 10, margin: [0, 18, 0, 8] });
    // Adding the images to the pdf if this journal has any.
    /* The PdfMake libray does not support get image from outside's url. So, the code belowe will not work.
    if (journal.uploadImages && journal.uploadImages.length > 0) {
      let columns = [];
      journal.uploadImages.forEach(image => {
        if (columns.length === 3) columns = [];
        else if (columns.length === 0) pdfDocDefinition.content.push({ columns, columnGap: 10 });
        columns.push({ width: '25%', image });
      });
    }
    */
  });
  return pdfDocDefinition;
};

/* Fetching the reading and its all journal and then convert it to pdf data via PdfMake library. */
normalRouter.post('/outputPdfBasedOnId', (req, res) => {
  const { readingId, jwtMessage, readingDataUrl } = req.body;
  const user = verifyJWT({ message: jwtMessage, res });
  mongodb.fetchReadingBasedOnId({ readingId, userId: user._id })
    .then(reading => {
      const pdfDocGenerator = pdfmake.createPdf(getPdfDocDefinition({
        readingId, readingDataUrl, journals: reading.journal_entries
      }));
      pdfDocGenerator.getDataUrl(data => res.end(data));
    })
    .catch(err => logger.error('/fetchReadingBasedOnId', err));
});

/* Call the Cloudinary api to delete some images that have already been uploaded. */
normalRouter.delete('/deleteUploadImages', (req, res) => {
  const user = verifyJWT({ message: req.query.jwtMessage, res });
  if (user && user.isAuth) req.query.publicIds.split(',').forEach(publicId => cloudinary.v2.uploader.destroy(publicId));
  res.end();
});

/* Update user's userGroups */
normalRouter.put('/updateUserGroup', (req, res) => {
  const {
    jwtMessage, newGroupName, oldGroupName, userList, isUpdate
  } = req.body;
  const userId = verifyJWT({ message: jwtMessage, res })._id;
  const user = { [`settings.userGroups.${newGroupName}`]: userList };
  let removeFields = null;
  if (isUpdate && newGroupName !== oldGroupName) removeFields = { [`settings.userGroups.${oldGroupName}`]: '' };
  mongodb.updateUser(userId, user, removeFields)
    .then(result => res.json({ isAuth: true, ...result.value }));
});

/* Delete a user group from the user database. */
normalRouter.delete('/deleteUserGroup', (req, res) => {
  const userId = verifyJWT({ message: req.query.jwtMessage, res })._id;
  mongodb.deleteUserGroup({ userId, groupName: req.query.groupName })
    .then(result => res.json({ isAuth: true, ...result.value }));
});

/* Save the new custom name for a user */
normalRouter.put('/saveCustomName', (req, res) => {
  const userId = verifyJWT({ message: req.body.jwtMessage, res })._id;
  const customName = req.body.customName.length > 20 ?
    req.body.customName.slice(0, 20) : req.body.customName; // If customName longer than 20, just get the first 20 characters.
  mongodb.updateUser(userId, { 'settings.customName': customName }).then(result => res.json({ isAuth: true, ...result.value }));
});

module.exports = normalRouter;
