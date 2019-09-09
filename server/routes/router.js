const Express = require('express');
const router = Express.Router();
const db = require('../../database/index');

router.post('/blast', (req, res) => {
  res.end(JSON.stringify(req.body))
});

router.post('/messages', (req, res) => {
  const phone = req.body.From;

  const processMessage = (subscriber) => {
    let msg = req.body.Body || '';
    msg = msg.toLowerCase().trim();

    if (msg === 'subscribe' || 'unsubscribe') {
      db.toggleSub(phone, (err, data) => {
        if(err) {
          throw new Error(err);
        } else {
          if(data.subscribed === true) {
            res.end('You are now subscribed for updates');
          } else {
            res.end('You have unsubscribed. Text "subscribe" to start recieving updates again');
          }
        }
      });
    }
  }

  db.addSubIfNotExists(phone, (err, sub, newSub) => {
    if(err) {
      throw new Error(err);
    } else if(newSub) {
      res.end(sub);
    } else {
      processMessage(sub);
    }
  });
});

module.exports = router;