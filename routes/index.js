const express = require('express')
const router = express.Router()
const Prateek = require('../models/account')

router.get('/', (req, res) => {
    res.render('index', {title: 'Home', account: new Prateek()});
  })

router.post('/account', (req, res) => {
  res.send(req.body)
})

module.exports = router