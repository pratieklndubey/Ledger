const express = require('express')
const router = express.Router()
const Account = require('../models/account')

router.get('/',  (req, res) => {
    res.render('account/index', {title:'Account'});
  })

  router.post('/', async (req, res) => {
    const account = new Account({
      name: req.body.name,
      initbal: req.body.initbal,
      currbal: req.body.initbal,
      transaction:
     [{title:"Opening Balance", 
     amount:req.body.initbal, 
     category:"Savings", 
     isexpense: false, 
     postranbal: req.body.initbal, 
     description: "Opened account with " + req.body.initbal +"\u20B9."}]
    })
    //res.send(account)
    const newAccount = await account.save()
    res.redirect('account')
  })

module.exports = router