const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect('mongodb://localhost/twilio-flex', mongooseOptions);

const Subscriber = mongoose.model('Subscriber', require('./models/subscriber'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose connection successful');
});

const addSub = phone => {
  const newSubscriber = new Subscriber({ phone: phone });
  console.log(newSubscriber);
  return newSubscriber.save()
    .catch(err => {
      throw new Error(err);
    });
};

const findIfSubExists = phone => {
  return Subscriber.findOne({ phone: phone })
    .catch(err => {
      throw new Error(err);
    })
}

const toggleSub = subscriber => {
  subscriber.subscribed = !subscriber.subscribed;
  return subscriber.save()
    .then(updatedSub => {
      return updatedSub;
    })
    .catch(err => {
      throw new Error(err);
    });
}

const getAllSubscribers = () => {
  return Subscriber.find({subscribed: true})
    .then(data => {
      return data;
    })
    .catch(err => {
      throw new Error(err);
    });
}

module.exports = {
  addSub: addSub,
  toggleSub: toggleSub,
  getAllSubscribers: getAllSubscribers,
  findIfSubExists: findIfSubExists
}