const Express = require('express');
const router = Express.Router();
const db = require('../../database/index');
const Promise = require('bluebird');
const sendSMStoAllSubs = require('../actions/sendSMStoAllSubs');
const sendSMS = require('../actions/sendSMS');
const sendToFlex = require('../actions/sendToFlex');

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
  const phone = req.body.From;

  const processMessage = Promise.method(subscriber => {
    let msg = req.body.Body || '';
    let response = '';
    msg = msg.toLowerCase().trim();
    console.log('default');
    let code = 200;

    if (msg !== 'subscribe' && msg !== 'unsubscribe') {
      return {
        code: code,
        phone: phone,
        response: response === '' ? req.body.Body : response
      };
    } else {
      return db.toggleSub(subscriber, msg)
        .then(data => {
          let response = {
            code: code,
            phone: phone
          };
          if(data.subscribed === true) {
            console.log('newly subscribed');
            respond('Thank you for subscribing! You\'ll recieve future updates here.', response.phone);
            code = 210;
          } else {
            console.log('newly unsubscribed');
            code = 211;
            respond('You have unsubscribed. Text SUBSCRIBE to restart recieving updates.', response.phone);
          }
          return {code: 400}
        })
        .catch(err => {
          throw new Error(err);
        });
    }
  });

  db.findIfSubExists(phone)
    .then(sub => {
      console.log(sub);
      if(!sub) {
        console.log('sub not found');
        code = 201;
        return db.addSub(phone)
          .then(sub => sub)
          .catch(err => {
            throw new Error(err);
          });
      }
      return sub;
    })
    .then(sub => {
      return processMessage(sub);
    })
    .then(response => {
      switch(response.code) {
        case 201:
          respond('Thank you for contacting us! Text SUBSCRIBE to begin recieving updates.', response.phone);
          break;
        case 210:
          respond('Thank you for subscribing! You\'ll recieve future updates here.', response.phone);
          break;
        case 211:
          respond('You have unsubscribed. Text SUBSCRIBE to restart recieving updates.', response.phone);
          break;
        case 200:
          // console.log('sending to flex');
          // sendToFlex(response);
          res.end(400);
          break;
        }
    })
    .catch(err => {
      console.log(err);
      code = 400;
    });
});

module.exports = router;