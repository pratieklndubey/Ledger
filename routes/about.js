const express = require('express')
const router = express.Router()
const Account = require('../models/account')
const fs = require('fs')
const spawn = require('child_process').spawn
const util = require('util')

router.get('/', async (req, res) => {
  res.render('about/index', {page:"",title: 'About',relative:'../',option:"",search:"",bell:"",searchRelative:'',calculate:"",god:"shivaji",noticount:""});
})

module.exports = router