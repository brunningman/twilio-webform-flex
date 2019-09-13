const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/twilio-flex', {useNewUrlParser: true});

const Subscriber = require('./models/subscriber');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose connection successful');
});

const addSubIfNotExists = (phone, callback) => {
  Subscriber.findOne({ phone: phone }, (err, sub) => {
    if(err) {
      callback(err, null);
    } else {
      if(!sub) {
        const newSubscriber = new Subscriber({ phone: phone });

        newSubscriber.save((err, newSub) => {
          if(err || !newSub) {
            callback(err ? err : 'We couldn\'t sign you up, try again later.', null);
          } else {
            callback(null, newSub, 'new');
          }
        });
      } else {
        callback(null, sub, null);
      }
    }
  });
};

const toggleSub = (subscriber, callback) => {
  subscriber.subscribed = !subscriber.subscribed;
  subscriber.save((err, updatedSub) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, updatedSub);
      }
  });
}

const getAllSubscribers = callback => {
  Subscriber.find({
    subscribed: true
  }, (err, cursor) => {
    if(err) {
      callback(err, null);
    } else {
      cursor.toArray(callback);
    }
  });
}

module.exports = {
  addSubIfNotExists: addSubIfNotExists,
  toggleSub: toggleSub,
  getAllSubscribers: getAllSubscribers
}