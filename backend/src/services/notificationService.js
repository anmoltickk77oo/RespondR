const webpush = require('web-push');
const logger = require('../utils/logger');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Sends a push notification to a specific subscription.
 * @param {Object} subscription - The push subscription object from the client.
 * @param {Object} payload - The notification payload (title, body, etc).
 */
const sendPushNotification = async (subscription, payload) => {
  try {
    const payloadString = JSON.stringify(payload);
    await webpush.sendNotification(subscription, payloadString);
    logger.info('Push notification sent successfully');
  } catch (error) {
    logger.error('Error sending push notification: %o', error);
  }
};

module.exports = { sendPushNotification };
