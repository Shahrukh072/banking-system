// accountSchema.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
