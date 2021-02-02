const express = require('express')
const router = express.Router()
const Account = require('../models/account')

router.get('/:id', async (req, res) => {
    let searchOptions = {}
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/index', {title:'Account', account: account, option: "\u2630"});
    //res.send(account)
  })
  router.put('/:id/', async (req, res) => {
    let account = await Account.findById(req.params.id)
    account.currbal = req.body.currbal
    await account.save()
    res.redirect(req.params.id)
  })
  router.put('/:id/:tid', async (req, res) => {
    if(req.body.amount != 0){
      let account = await Account.findById(req.params.id)
    let transaction = account.activity
    let entry = transaction.find(entry => entry._id == req.params.tid)
    entry.postranbal = entry.postranbal - entry.amount
    entry.description = req.body.description
    entry.amount = req.body.amount
    if(entry.isexpense && entry.amount > 0)
    {
      entry.amount *= -1.00
    }
    entry.title = req.body.title
    entry.postranbal = entry.postranbal + entry.amount
    account.transum = entry.postranbal
    await account.save()
    }
    res.redirect("../"+req.params.id)
  })

  router.post('/', async (req, res) => {
    const formatter = new Intl.NumberFormat('en-US', {
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
    res.redirect('account/'+account._id)
  })

module.exports = router