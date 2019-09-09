const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  phone: String,
  subscribed: {
    type: Boolean,
    default: false
  }
});

module.exports = SubscriberSchema;