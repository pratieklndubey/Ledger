const express = require('express')
const router = express.Router()
const Account = require('../models/account')

router.get('/', async (req, res) => {
    const account = await Account.find()
    res.render('index', {page:"",title: 'Home', newaccount: new Account(), account: account, calculate:"", option: '',search:"",bell:"",relative:'',searchRelative:'',god:"durgamata",noticount:""});
  })

module.exports = router