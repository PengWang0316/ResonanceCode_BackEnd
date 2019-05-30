const jwt = require('jsonwebtoken'); // May need to be deleted

const normalRouter = require('express').Router();
// const winston = require('winston');  Moved out to the utils
// const webpush = require('web-push');
const pdfmake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
const cloudinary = require('cloudinary');

const { getDateString } = require('../Util');
const verifyJWT = require('../utils/VerifyJWT');
const logger = require('../utils/Logger');

pdfmake.vfs = pdfFonts.pdfMake.vfs; // Setting the default font for pdfMake libaray.

require('dotenv').config(); // Loading .env to process.env
// const USERNAME = 'resonancecode_webuser';
// const PASSWORD = 'cyJz2b4vGb3EgHRf0Khq'; // username
const { NORMAL_ROLE } = process.env;
const mongodb = require('../MongoDB');

// Functions import
const getJournal = require('../controllers/FetchJournal');
const updateJournal = require('../controllers/UpdateJournal');
const createReading = require('../controllers/CreateReading');
const createJournal = require('../controllers/CreateJournal');
const deleteReading = require('../controllers/DeleteReading');
const fetchJournals = require('../controllers/FetchJournals');
const fetchReadings = require('../controllers/FetchReadings');
const deleteJournal = require('../controllers/DeleteJournal');
const updateHexagram = require('../controllers/UpdateHexagram');
const fetchHexagrams = require('../controllers/FetchHexagrams');
const searchReadings = require('../controllers/SearchReadings');
const fetchAllUserList = require('../controllers/FetchAllUserList');
const fetchUsersAmount = require('../controllers/FetchUsersAmount');
const fetchAllHexagrams = require('../controllers/FetchAllHexagrams');
const fetchAllReadingList = require('../controllers/FetchAllReadingList');
const fetchReadingsAmount = require('../controllers/FetchReadingsAmount');
const isUserNameAvailable = require('../controllers/IsUserNameAvailable');
const fetchJwtMessageVerify = require('../controllers/FetchJwtMessageVerify');
const updateSettingCoinMode = require('../controllers/UpdateSettingCoinMode');
const updateJournalShareList = require('../controllers/UpdateJournalShareList');
const fetchUnattchedJournals = require('../controllers/FetchUnattachedJournals');
const deleteUnattachedJournal = require('../controllers/DeleteUnattachedJournal');
const FetchHexagramBasedOnImg = require('../controllers/FetchHexagramBasedOnImg');
const fetchReadingsBasedOnName = require('../controllers/FetchReadingsBasedOnName');
const fetchReadingsBasedOnHexagram = require('../controllers/FetchReadingsBasedOnHexagram');
const fetchJournalBaseOnJournalReading = require('../controllers/FetchJournalBaseOnJournalReading');
// API_BASE_URL = "/"; Deprecated
// const axios = require('axios');
// const querystring = require('querystring');


cloudinary.config({ // confige the cloudinary library.
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
normalRouter.get('/jwtMessageVerify', fetchJwtMessageVerify);

/** ********************  Create a new reading  *************************** */
normalRouter.post('/reading', createReading);

/** ********************  Create a new journal  *************************** */
normalRouter.post('/journal', createJournal);

/** ******************** Update a journal  *************************** */
normalRouter.put('/journal', updateJournal);

/** ******************** Update a hexagram  *************************** */
normalRouter.put('/hexagram', updateHexagram);

/** fetch readings */
normalRouter.get('/fetchReadings', fetchReadings);

/* Getting journals list */
normalRouter.get('/fetchJournals', fetchJournals);

/** Getting unattached journals list */
normalRouter.get('/fetchUnattachedJournals', fetchUnattchedJournals);

/** *************  Getting one journal  ******************** */
normalRouter.get('/journal', getJournal);

/** Fetch a journal based on both reading and journal's id */
normalRouter.get('/journalBasedOnJournalReading', fetchJournalBaseOnJournalReading);

/** *************  Getting hexagrams  ******************** */
normalRouter.get('/fetchHexagrams', fetchHexagrams);

/** *************  Getting all hexagrams  ******************** */
normalRouter.get('/fetchAllHexagrams', fetchAllHexagrams);

/** Fetching one hexagram */
normalRouter.get('/fetchHexagramBasedOnImg', FetchHexagramBasedOnImg);

/** *************  Getting readings by hexagram's id  ******************** */
normalRouter.get('/fetchReadingsBaseOnHexagram', fetchReadingsBasedOnHexagram);

/** *********  Fetching readings by searching criterias ************ */
normalRouter.get('/searchReadings', searchReadings);

/** Fetching the reading list */
normalRouter.get('/fetchAllReadingList', fetchAllReadingList);

/** ****************  Getting reading by searching name   ********************* */
normalRouter.get('/fetchReadingsBasedOnName', fetchReadingsBasedOnName);

/** ***************  Delete reading  ***************************** */
normalRouter.delete('/deleteReading', deleteReading);

/** *****************  Delete one journal   ************************ */
normalRouter.post('/deleteJournal', deleteJournal);

/** Delete one unattached journal */
normalRouter.delete('/deleteUnAttachedJournal', deleteUnattachedJournal);

/** Check whether user name is available */
normalRouter.get('/isUserNameAvailable', isUserNameAvailable);

// TODO: Should be removed eventually. Has already been moved to utils/GetReturnUserObject.js
/** Get information from database's return and sign the user Object with jwt.
  * @param {object} user comes from database.
  * @return {object} return an object that contains jwt message and formated user object.
*/
const getReturnUserObject = user => {
  const returnUser = Object.assign({
    isAuth: true, role: user.role || NORMAL_ROLE,
  }, user);
  return { jwt: jwt.sign(returnUser, process.env.JWT_SECERT), user: returnUser };
};

/** Changing a user's default hexagram choosing mode.
  * After update the database, resign the jwt and send back the user object for redux and jwtMessage to localstorage.
*/
normalRouter.put('/updateSettingCoinMode', updateSettingCoinMode);

/* Fetch how many reading a user has */
normalRouter.get('/fetchReadingsAmount', fetchReadingsAmount);

/* Fetch the total number of users */
normalRouter.get('/fetchUsersAmount', fetchUsersAmount);

/* Fetch user names based on the page number */
normalRouter.get('/fetchAllUserList', fetchAllUserList);

/* Updating the share list for a reading's journal. */
normalRouter.put('/updateJournalShareList', updateJournalShareList);

const eliminateUnnecessaryJournal = ({ readings, userId }) => {
  // const newReadings = { ...readings };
  const newReadings = readings.map(reading => {
    const newReading = Object.assign({}, reading);
    newReading.journal_entries = newReading.journal_entries.filter(journal => {
      let isReturn = false;
      if (journal.shareList) journal.shareList.forEach(shareInfo => { if (shareInfo.id === userId) isReturn = true; });
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
    numberPerpage: req.query.numberPerpage,
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
    .then(result => res.json(getReturnUserObject(result.value))) // TODO: Using getReturnUserObject util function
    .catch(err => logger.error('/savePushSubscription', err));
});

/* Setting the isPushNotification as false in the user account. */
normalRouter.put('/turnOffPushSubscription', (req, res) => {
  const user = verifyJWT({ message: req.body.jwtMessage, res });
  mongodb.updateUser(user._id, { 'settings.isPushNotification': false })
    .then(result => res.json(getReturnUserObject(result.value)))// TODO: Using getReturnUserObject util function
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
      }],
    },
    content: [
      { image: readingDataUrl, width: 550 }
    ],
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
        readingId, readingDataUrl, journals: reading.journal_entries,
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
    jwtMessage, newGroupName, oldGroupName, userList, isUpdate,
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
// Moved to Lambda
normalRouter.put('/saveCustomName', (req, res) => {
  const userId = verifyJWT({ message: req.body.jwtMessage, res })._id;
  const customName = req.body.customName.length > 20
    ? req.body.customName.slice(0, 20)
    : req.body.customName; // If customName longer than 20, just get the first 20 characters.
  mongodb.updateUser(userId, { 'settings.customName': customName }).then(result => res.json({ isAuth: true, ...result.value }));
});

module.exports = normalRouter;
