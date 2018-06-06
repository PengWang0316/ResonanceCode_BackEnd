const logger = require('./Logger');
const webpush = require('web-push');

const NOTIFICATION_MESSAGE = 'Someone shared a reading to you. Click to view it.';

require('dotenv').config(); // Loading .env to process.env

module.exports = users => {
  const notificatioOptions = {
    vapidDetails: {
      subject: 'https://kairoscope.resonancepath.com',
      publicKey: process.env.APPLICATION_SERVER_PUBLIC_KEY,
      privateKey: process.env.APPLICATION_SERVER_PRIVATE_KEY
    }
  };
  let promiseChain = Promise.resolve();
  users.forEach(eachUser => {
    promiseChain = promiseChain.then(() =>
      Object.keys(eachUser.pushSubscriptions).forEach(key => webpush.sendNotification(eachUser.pushSubscriptions[key], NOTIFICATION_MESSAGE, notificatioOptions).catch(err => logger.error('existedShareList push notification error: statusCode: ', err.statusCode, 'error: ', err))));
  });
};
