const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
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
  initbal:{
    type: Number,
    
  },
  currbal: {
    type: Number,
    
  },
  transaction: {
    type: [transactionSchema]
  }
})

module.exports = mongoose.model('Account', accountSchema)