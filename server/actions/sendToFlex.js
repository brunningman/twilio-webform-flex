require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendToFlex = (messageObj) => {
  client
    .studio
    .flows(process.env.TWILIO_FLOW_SID)
    .executions
    .create({
        to: messageObj.phone,
        from: process.env.TWILIO_PHONE,
        parameters: JSON.stringify({
            body: messageObj.response
        })
    })
    .then(execution => {
        console.log(execution.sid);
    });
}

module.exports = sendToFlex;