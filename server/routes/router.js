const Express = require('express');
const router = Express.Router();
const db = require('../../database/index');
const sendSMStoAllSubs = require('../actions/sendSMStoAllSubs');
const sendSMS = require('../actions/sendSMS');
const Promise = require('bluebird');

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

  db.getAllSubscribers()
    .then(subs => {
      sendSMStoAllSubs(message, imgURL, subs, (err, data) => {
        if(err) {
          console.log('Error:', err.message);
          req.flash('Errors', err.message);
        } else {
          req.flash('Successes', 'Messages are on their way');
          req.redirect('/');
        }
      });
    })
    .catch(err => {
      throw new Error(err);
    })
});

router.post('/messages', (req, res) => {
  // req.body = JSON.parse(req.body);
  console.log(req.body);
  const phone = req.body.From;

  const processMessage = Promise.method(subscriber => {
    let msg = req.body.Body || '';
    let response = '';
    msg = msg.toLowerCase().trim();
    console.log('message', msg);
    let code = 200;

    if (msg === 'subscribe' || msg === 'unsubscribe') {
      console.log('toggling')
      db.toggleSub(subscriber)
        .then(data => {
          if(data.subscribed === true) {
            console.log(data);
            // respond(response, phone);
          } else {
            response = 'You have unsubscribed. Text "subscribe" to start recieving updates again';
          }
          return response;
        })
        .catch(err => {
          throw new Error(err);
        });
    } else {
      response = 'Thank you for messaging us, a representative will contact you shortly';
      code = 201
    }
    return {
      code: code,
      phone: phone,
      response: response
    };
  });

  db.findIfSubExists(phone)
    .then(sub => {
      if(!sub) {
        return db.addSub(phone)
          .then(sub => sub)
          .catch(err => {
            throw new Error(err);
          })
      }
      return sub;
    })
    .then(sub => {
      return processMessage(sub);
    })
    .then(response => {
      res.json({ code: response.code, phone: response.phone, resoponse: response.response });
    })
    .catch(err => {
      console.log(err);
      code = 400;
    });
});

module.exports = router;