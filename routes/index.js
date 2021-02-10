const express = require('express')
const router = express.Router()
const Account = require('../models/account')

router.get('/', async (req, res) => {
    const account = await Account.find()
    res.render('index', {title: 'Home', newaccount: new Account(), account: account, option: '',relative:''});
  })

module.exports = router