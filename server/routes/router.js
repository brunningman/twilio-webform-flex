const Express = require('express');
const router = Express.Router();
const db = require('../../database/index');
const sendSMStoAllSubs = require('../actions/sendSMStoAllSubs');

const respond = message => {
  res.type('text/xml');
  res.render('twiml', {
    message: message
  });
}

router.post('/messages/send', (req, res) => {
  const message = req.body.message;
  const imgURL = req.body.imgURL;

  db.getAllSubscribed((err, subs) => {
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
  const phone = req.body.From;


  const processMessage = (subscriber) => {
    let msg = req.body.Body || '';
    msg = msg.toLowerCase().trim();

    if (msg === 'subscribe' || 'unsubscribe') {
      db.toggleSub(subscriber, (err, data) => {
        if(err) {
          throw new Error(err);
        } else {
          if(data.subscribed === true) {
            const response = 'You are now subscribed for updates';
          } else {
            const response = 'You have unsubscribed. Text "subscribe" to start recieving updates again';
          }
        }
      });
    } else {
      const response = 'Sorry, we didn\'t understand that. Available commands are: subscribe or unsubscribe';
    }
    respond(response);
  }

  db.addSubIfNotExists(phone, (err, sub, newSub) => {
    if(err) {
      respond('We couldn\'t sign you up, try again later');
    } else if(newSub) {
      respond('Thanks for contacting us! Text "subscribe" to receive updates via text message.');
    } else {
      processMessage(sub);
    }
  });
});

module.exports = router;