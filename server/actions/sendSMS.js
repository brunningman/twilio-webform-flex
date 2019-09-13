require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = (messageObj) => {
  client.messages
    .create(messageObj)
    .then(message => {
      var masked = message.to.substr(0, message.to.length - 5);
      masked += '*****';
      console.log('Message sent to ' + masked);
      return masked;
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = sendSMS;