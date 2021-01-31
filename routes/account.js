const express = require('express')
const { replaceOne } = require('../models/account')
const router = express.Router()
const Account = require('../models/account')

router.get('/', async (req, res) => {
    let searchOptions = {}
    searchOptions._id = req.query._id
    const account = await Account.find(searchOptions)
    res.render('account/index', {title:'Account', account: account, option: "\u2630"});
  })

  router.post('/', async (req, res) => {
    const formatter = new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    })
    const account = new Account({
      name: req.body.name,
      transum: req.body.currbal,
      currbal: req.body.currbal,
      activity:
     [{title:"Opening Balance", 
     amount:req.body.currbal, 
     category:"Savings", 
     isexpense: false, 
     postranbal: req.body.currbal, 
     description: "Opened account with " + formatter.format(req.body.currbal)}]
    })
    const newAccount = await account.save()
    res.redirect('account?_id='+account._id)
  })

module.exports = router