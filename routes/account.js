const express = require('express')
const router = express.Router()
const Account = require('../models/account')
const CryptoJS = require('crypto')

router.get('/', async (req, res) => {
  res.redirect('../')
})
router.get('/:id/chart', async (req, res) => {
  let searchOptions = {}
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/chart/index', {title:account[0].name, account: account, option: "",relative:'../../'});
  //res.send(account)
})
router.get('/:id', async (req, res) => {
    let searchOptions = {}
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/index', {title:account[0].name, account: account, option: "\u2630",relative:'../'});
    //res.send(account)
  })
  router.put('/:id/', async (req, res) => {
    let account = await Account.findById(req.params.id)
    if(req.body.action == 'UpBal')
    {
      account.currbal = req.body.currbal
    await account.save()
    res.redirect(req.params.id)
    }
    else if(req.body.action == 'Creatran')
    {
      if(req.body.amount != 0){
        const categoriesExpense = ["Food","Fuel","Automobile","Donations","Investment","Clothing","Personal Care","Groceries","Entertainment","Study","Travel/Vacation","Phone","House Hold","Health Care", "Gift"]
        const categoriesIncome = ["Savings","Salary","Interest","Gift","Credit"]
        let account = await Account.findById(req.params.id)
        let transaction = account.activity
        checkExpense = categoriesIncome.includes(req.body.category)
        actualAmount = (checkExpense?req.body.amount*1.00:req.body.amount*-1.00)
        let newTransaction = {title: req.body.title, amount: actualAmount, category: req.body.category, description: req.body.description, isexpense: !checkExpense, postranbal: ((account.transum+actualAmount)*1.00)}
        account.activity.push(newTransaction)
        account.transum = (account.transum+actualAmount)*1.00
        if(checkExpense)
        {
          account.income += req.body.amount*1.00
        }
        else{
          account.expense += req.body.amount*1.00
        }
        //res.send(newTransaction)
        await account.save()
        res.redirect("../"+req.params.id)
      }
      }
  
  })
  router.put('/:id/:tid', async (req, res) => {
    if(req.body.action == 'Delete'){
      let account = await Account.findById(req.params.id)
      let transaction = account.activity
      let entry = transaction.find(entry => entry._id == req.params.tid)
      validate = ((CryptoJS.createHash('sha256').update(req.body.pass).digest('hex')) == account.passWord)
      if(validate){
        entry.isActive = false
        account.transum = account.transum - entry.amount
        if(entry.isexpense){
          account.expense += entry.amount
        }
        else{
          account.income -= entry.amount
        }
        await account.save()
      }
    }
    
    
    else if(req.body.action == 'Update'){
      if(req.body.amount != 0){
      let account = await Account.findById(req.params.id)
      let transaction = account.activity
      let entry = transaction.find(entry => entry._id == req.params.tid)
      entry.description = req.body.description      
      entry.title = req.body.title
      entry.category = req.body.category      
      await account.save()
    }
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
      passWord: CryptoJS.createHash('sha256').update(req.body.pass).digest('hex'),
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