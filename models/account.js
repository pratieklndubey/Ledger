const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    
  },
  title: {
    type: String,
    
  },
  amount: {
    type: Number,
    
  },
  category: {
    type: String,
    
  },
  isexpense: {
    type: Boolean,
    
  },
  postranbal:{
    type: Number,
    
  },
  tstamp: {
    type: Date,
    default: Date.now(),    
  },
  description: {
    type: String
  }
})

const accountSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    
  },
  name: {
    type: String,
    
  },
  transum:{
    type: Number,
    
  },
  currbal: {
    type: Number,
    
  },
  activity: {
    type: [activitySchema]
  }
})

module.exports = mongoose.model('Account', accountSchema)