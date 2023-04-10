const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  amount: Number,
  category: String,
  isexpense: Boolean,
  postranbal: Number,
  tstamp: {
    type: Date,
    default: Date.now()
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

const notificationSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  amount: Number,
  category: String,
  isexpense: Boolean,
  tstamp: Date,
  repeat: String,
  description: String,
  status: String
});

const assetSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  description: String,
  amount: Number,
  units: Number,
  category: String,
  tape: {
    type: String,
    default: 'Nothing'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const accountSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  tcreate: {
    type: Date,
    default: Date.now()
  },
  dob: {
    type: Date,
    default: Date.now()
  },
  dnw: {
    type: Number,
    default: 0
  },
  aor: {
    type: Number,
    default: 50
  },
  expense: {
    type: Number,
    default: 0
  },
  income: Number,
  uexpense: {
    type: Number,
    default: 0
  },
  uincome: {
    type: Number,
    default: 0
  },
  transum: Number,
  currency: String,
  currbal: Number,
  onhold: {
    type: Number,
    default: 0
  },
  debt: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  prook: {
    type: Number,
    default: 0
  },
  activity: [activitySchema],
  asset: [assetSchema],
  notification: [notificationSchema]
});

module.exports = mongoose.model('Account', accountSchema);
