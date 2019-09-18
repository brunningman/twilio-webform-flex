require('dotenv').config();
const sendSMS =  require('./sendSMS');

const sendSMStoAllSubs = (body, url, subs, callback) => {
  subs.forEach(sub => {
    const message = {
      body: body,
      to: sub.phone,
      from: process.env.TWILIO_PHONE
    }

    if(url) {
      message.mediaURL = url;
    }
    sendSMS(message);
  })
}

module.exports = sendSMStoAllSubs;