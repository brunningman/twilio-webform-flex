const Express = require('express');
const router = Express.Router();
const db = require('../../database/index');
const sendSMStoAllSubs = require('../actions/sendSMStoAllSubs');
const sendSMS = require('../actions/sendSMS');

const respond = (message, subPhone) => {
  // res.type('text/xml');
  // res.render('twiml', {
  //   message: message
  // });
  sendSMS({
    to: subPhone,
    body: message
  });
}

router.post('/messages/send', (req, res) => {
  const message = req.body.message;
  const imgURL = req.body.imgURL;

  db.getAllSubscribers((err, subs) => {
    if(err) {
      throw new Error(err);
    } else {
      sendSMStoAllSubs(message, imgURL, subs, (err, data) => {
        if(err) {
          console.log('Error:', err.message);
          req.flash('Errors', err.message);
        } else {
          req.flash('Successes', 'Messages are on their way');
          req.redirect('/');
        }
      })
    }
  })
});

router.post('/messages', (req, res) => {
  console.log(req.body);
  const phone = req.body.From;

  const processMessage = (subscriber) => {
    let msg = req.body.Body || '';
    let response = '';
    msg = msg.toLowerCase().trim();

    if (msg === 'subscribe' || 'unsubscribe') {
      db.toggleSub(subscriber, (err, data) => {
        if(err) {
          throw new Error(err);
        } else {
          if(data.subscribed === true) {
            response = 'You are now subscribed for updates';
            console.log(data);
            respond(response, phone);
          } else {
            response = 'You have unsubscribed. Text "subscribe" to start recieving updates again';
            respond(response, phone);
          }
        }
      });
    } else {
      response = 'Sorry, we didn\'t understand that. Available commands are: subscribe or unsubscribe';
      respond(response, phone);
    }
  }

  db.addSubIfNotExists(phone, (err, sub, newSub) => {
    if(err) {
      respond('We couldn\'t sign you up, try again later', phone);
    } else if(newSub) {
      respond('Thanks for contacting us! Text "subscribe" to receive updates via text message.', req.body.From);
    } else {
      processMessage(sub);
    }
  });
});

module.exports = router;