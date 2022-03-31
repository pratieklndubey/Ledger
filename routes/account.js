const express = require('express')
const router = express.Router()
const Account = require('../models/account')
const fs = require('fs')
const spawn = require('child_process').spawn
const exec = require('child_process').exec
const util = require('util')

router.get('/', async (req, res) => {
  res.redirect('../')
})

router.get('/:id/search', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  let searchOptions = {}
  year = new Date().getUTCFullYear()
  month = new Date().getMonth()
  searchOptions._id = req.params.id
  const account = await Account.find(searchOptions)
  res.render('account/search/index', {month:month,year:year,option:"",title:account[0].name, account: account,relative:'../../../',search:"",calculate:"",bell:"",searchRelative:'',god:"hanumanji",noticount:"",priceGold:goldData,priceSilver:silverData,priceStocks:stockPrices,tickerStocks:stockTickers});
})
router.get('/:id/search/result/:query', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  let matchCriteria = /(?<=\[).*?(?=\])/;
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  let searchOptions = {}
  year = new Date().getUTCFullYear()
  month = new Date().getMonth()
  searchOptions._id = req.params.id
  const account = await Account.find(searchOptions)
  Values = req.params.query.split('+')
  const Title = Values[0]
  const Description = Values[1]
  const Category = Values[2]
  var From = new Date(Values[3])
  var To = new Date(Values[4])
  var result = []
  var sum = 0
  var matchCriteriaTitle = "^.*?"+Title+".*?$"
  var matchCriteriaDescription = "^.*?"+Description+".*?$"
  account[0].activity.filter(record => record.isActive && ((Category != 'All Expenses' && Category != 'All Incomes')?true:(Category == 'All Expenses'?record.isexpense:!record.isexpense)) && (Values[3]==''?true:record.tstamp >= From) && (Values[4]==''?true:record.tstamp <= To) && ((Category=='All Transactions' || Category=='All Expenses' || Category=='All Incomes')?true:record.category == Category) && (Description==''?true:record.description.match(matchCriteriaDescription)) && (Title==''?true:record.title.match(matchCriteriaTitle))).forEach(record =>{
    result.push(record)
    sum+=record.amount
  })
  Values[3]==''?From=new Date(account[0].tcreate):From=new Date(Values[3])
  Values[4]==''?To=new Date():To=new Date(Values[4])
  res.render('account/search/result/index', {tranType:Category,totalAmount:sum,searchto:To,searchfrom:From,result:result,month:month,year:year,option:"",title:account[0].name, account: account,relative:'../../../../',search:"",calculate:"",bell:"",searchRelative:'',god:"hanumanji",noticount:"",priceGold:goldData,priceSilver:silverData,priceStocks:stockPrices,tickerStocks:stockTickers});
  
})
router.get('/:id/assets', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  let searchOptions = {}
  year = new Date().getUTCFullYear()
  month = new Date().getMonth()
  searchOptions._id = req.params.id
  const account = await Account.find(searchOptions)
  res.render('account/assets/index', {title:account[0].name, account: account,month:month,year:year, option: "",calculate:"",search:"",bell:"",searchRelative:'',relative:'../../',priceGold:goldData,priceSilver:silverData,priceStocks:stockPrices,tickerStocks:stockTickers,god:"krishnaji",noticount:""});
})
router.put('/:id/assets/:aid', async(req, res) => {
  let account = await Account.findById(req.params.id)
      let transaction = account.asset
      let entry = transaction.find(entry => entry._id == req.params.aid)
      if(req.body.action == 'updatere')
      {
        entry.tape = req.body.amount
        await account.save()
      }
      else if(entry.category == "Equity" && req.body.action == "updtaEmbed")
      {
      entry.tape = req.body.embed   
      await account.save()
      }
      else if(req.body.action == "bought"){
        if(entry.category != "Extra Charge"){
        entry.units += parseFloat(req.body.units)
        }
        entry.amount += parseFloat(req.body.amount)
        if(entry.category == "Gold" || entry.category == "Silver"){
        descriptionTransaction = req.body.units + " grams of "+entry.category
        titleTransaction = entry.category
        }
        else if(entry.category == "Equity")
        {
          descriptionTransaction = req.body.units + " shares of "+entry.description
          titleTransaction = entry.description
        }
        else{
          descriptionTransaction = req.body.description
          titleTransaction = entry.category
        }
        let newTransaction = {title: titleTransaction, amount: req.body.amount*-1.00, category: "Investment",tstamp:Date.now(), description: descriptionTransaction, isexpense: true, postranbal:(account.transum+account.onhold-req.body.amount*1.00)}
        account.activity.push(newTransaction)
        account.transum -= req.body.amount*1.00
        account.expense += req.body.amount*1.00
        if(entry.category == "Extra Charge"){
          account.prook -= req.body.amount*1.00
        }
        await account.save()
      }
      else if(req.body.action == "sold"){
        if(entry.units >= req.body.units){
        price = entry.amount/entry.units
        buyAmount = price*req.body.units*1.00
        entry.units -= req.body.units
        entry.amount = price*entry.units
        soldCost = price*req.body.units*1.00
        if(entry.units == 0){
          entry.isActive = false
        }
        if(entry.category == "Gold" || entry.category == "Silver"){
          descriptionTransaction = req.body.units + " grams of "+entry.category
          titleTransaction = entry.category
          }
          else if(entry.category == "Equity")
          {
            descriptionTransaction = req.body.units + " shares of "+entry.description
            titleTransaction = entry.description
          }
          else{
            descriptionTransaction = req.body.units + "units of "+entry.category
            titleTransaction = entry.category
          }
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: account.currency,
            minimumFractionDigits: 2
          })
          descriptionTransaction = descriptionTransaction + " for " + formatter.format(((req.body.amount*1.00) - soldCost))
          let newTransaction = {title: titleTransaction, amount: req.body.amount*1.00, category: "Asset Liquidation",tstamp:Date.now(), description: descriptionTransaction, isexpense: false, postranbal:(account.transum+account.onhold+req.body.amount*1.00)}
          account.activity.push(newTransaction)
          account.transum += req.body.amount*1.00
          account.income += ((req.body.amount*1.00) - soldCost)
          account.expense -= buyAmount
          account.prook += ((req.body.amount*1.00) - soldCost)
        await account.save()
        }
      }
      res.redirect("../assets")
})
router.put('/:id/assets', async(req, res) => {
  let account = await Account.findById(req.params.id)
  let transaction = account.asset
  //let assetCreation = account.activity
  assetCategory = []
  equityCategory = []
  let matchCriteria = /(?<=\[).*?(?=\])/;
  transaction.forEach(investment => {
    if(!assetCategory.includes(investment.category)){
    assetCategory.push(investment.category)
    }
    if(investment.category == "Equity")
    {
      equityCategory.push(investment.description)
    }
  })
  
  if(req.body.category == "Equity"){
    let ticker = req.body.description.match(matchCriteria)
    if(!ticker){
      res.redirect("../assets")
    }
    else{
      ticker = ticker.toString()
      ticker = ticker.toUpperCase()
      if(!equityCategory.includes(ticker))
      {
      const process = spawn('python', ['./addStock.py',ticker])
      process.stdout.on('data', (data) => {
        if(data.toString().trim() == "True"){
          let newEquity = {units:req.body.units,amount:req.body.amount,category:req.body.category,description:ticker,tape:req.body.embed}
          account.asset.push(newEquity)
          descriptionTransaction = req.body.units + " shares of "+ticker
          let newTransaction = {title: ticker, amount: req.body.amount*-1.00, category: "Investment",tstamp:Date.now(), description: descriptionTransaction, isexpense: true, postranbal:(account.transum+account.onhold-req.body.amount)}
          account.activity.push(newTransaction)
          account.transum -= req.body.amount*1.00
          account.expense += req.body.amount*1.00
          account.save()
        }
        res.redirect('../assets')
      })
      }
      else{
        let equity = transaction.find(item => item.description == ticker)
        equity.units += parseFloat(req.body.units)
        equity.amount += parseFloat(req.body.amount)
        descriptionTransaction = req.body.units + " shares of "+ticker
        let newTransaction = {title: ticker, amount: req.body.amount*-1.00, category: "Investment",tstamp:Date.now(), description: descriptionTransaction, isexpense: true, postranbal:(account.transum+account.onhold-req.body.amount)}
        account.activity.push(newTransaction)
        account.transum -= req.body.amount*1.00
        account.expense += req.body.amount*1.00
        await account.save()
        res.redirect("../assets")        
      }
    }
    
}
  else if(req.body.category == "Gold" || req.body.category == "Silver"){    
  initiate = assetCategory.includes(req.body.category)
  if(!initiate) {
    let newMetal = {units:req.body.units,amount:req.body.amount,category:req.body.category,description:req.body.description}
    account.asset.push(newMetal)
    descriptionTransaction = req.body.units + " grams of "+req.body.category
    let newTransaction = {title: req.body.category, amount: req.body.amount*-1.00, category: "Investment",tstamp:Date.now(), description: descriptionTransaction, isexpense: true, postranbal:(account.transum+account.onhold-req.body.amount)}
    account.activity.push(newTransaction)
    account.transum -= req.body.amount*1.00
    account.expense += req.body.amount*1.00
  }
  else{
    let entry = transaction.find(entry => entry.category == req.body.category)
    entry.units += parseFloat(req.body.units)
    entry.amount += parseFloat(req.body.amount)
    descriptionTransaction = req.body.units + " grams of "+req.body.category
    let newTransaction = {title: req.body.category, amount: req.body.amount*-1.00, category: "Investment",tstamp:Date.now(), description: descriptionTransaction, isexpense: true, postranbal:(account.transum+account.onhold-req.body.amount)}
    account.activity.push(newTransaction)
    account.transum -= req.body.amount*1.00
    account.expense += req.body.amount*1.00
  }
  await account.save()
  res.redirect("../assets")
  }
  else if(req.body.category == "Extra Charge")
  {
    initiate = assetCategory.includes(req.body.category)
    if(!initiate) {
      let newCharge = {units:0,amount:req.body.amount,category:req.body.category,description:req.body.description}
      account.asset.push(newCharge)
    descriptionTransaction = "Extra Charge on Investment"
    let newTransaction = {title: req.body.category, amount: req.body.amount*-1.00, category: "Investment",tstamp:Date.now(), description: descriptionTransaction, isexpense: true, postranbal:(account.transum+account.onhold-req.body.amount)}
    account.activity.push(newTransaction)
    account.transum -= req.body.amount*1.00
    account.expense += req.body.amount*1.00
    account.prook -= req.body.amount*1.00
    }
    else{
      let entry = transaction.find(entry => entry.category == req.body.category)
      entry.amount += parseFloat(req.body.amount)
      descriptionTransaction = req.body.description
      let newTransaction = {title: req.body.category, amount: req.body.amount*-1.00, category: "Investment",tstamp:Date.now(), description: descriptionTransaction, isexpense: true, postranbal:(account.transum+account.onhold-req.body.amount)}
      account.activity.push(newTransaction)
      account.transum -= req.body.amount*1.00
      account.expense += req.body.amount*1.00
      account.prook -= req.body.amount*1.00
    }
    await account.save()
  res.redirect("../assets")

  }
  else{
    let newAsset = {units:req.body.units,amount:req.body.amount,category:req.body.category,description:req.body.description,tape:req.body.amount}
    account.asset.push(newAsset)
    descriptionTransaction = req.body.description
    let newTransaction = {title: req.body.category, amount: req.body.amount*-1.00, category: "Investment",tstamp:Date.now(), description: descriptionTransaction, isexpense: true, postranbal:(account.transum+account.onhold-req.body.amount)}
    account.activity.push(newTransaction)
    account.transum -= req.body.amount*1.00
    account.expense += req.body.amount*1.00
    await account.save()
  res.redirect("../assets")
  }
    
})

router.get('/:id/stats', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  let searchOptions = {}
  year = new Date().getUTCFullYear()
  month = new Date().getMonth()
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/stats/index', {title:account[0].name, account: account,month:month,year:year, option: "",calculate:"",search:"",bell:"",searchRelative:'',relative:'../../',priceStocks:stockPrices,tickerStocks:stockTickers,priceGold:goldData,priceSilver:silverData,god:"laxmimata",noticount:""});
  //res.send(account)
})
router.get('/:id/stats/:year/:month', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  year = req.params.year
    yearCart = []
    count = new Date().getUTCFullYear() - 2021
    for(i = 0;i<=count;i++){
      yearCart.push(new Date().getUTCFullYear()-i)
    }
    month = req.params.month-1
    if((month < 0 || month > 11) || isNaN(month))
    {
      month = new Date().getMonth()
    }
    if(!yearCart.includes(parseInt(year)))
    {
      year = new Date().getUTCFullYear()
    }
  let searchOptions = {}
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/stats/index', {title:account[0].name, account: account,month:month,year:year, option: "",calculate:"",search:"",bell:"",searchRelative:'',relative:'../../../../',priceStocks:stockPrices,tickerStocks:stockTickers,priceGold:goldData,priceSilver:silverData,god:"laxmimata",noticount:""});
  //res.send(account)
})
router.get('/:id/pivots', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  let searchOptions = {}
  year = new Date().getUTCFullYear()
  month = new Date().getMonth()
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/pivots/index', {title:account[0].name, account: account,month:month,year:year, option: "",calculate:"",search:"",bell:"",searchRelative:'',relative:'../../',priceStocks:stockPrices,tickerStocks:stockTickers,priceGold:goldData,priceSilver:silverData,god:"saraswatimata",noticount:""});
  //res.send(account)
})


router.get('/:id/pivots/:year/:month', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  year = req.params.year
    yearCart = []
    count = new Date().getUTCFullYear() - 2021
    for(i = 0;i<=count;i++){
      yearCart.push(new Date().getUTCFullYear()-i)
    }
    month = req.params.month-1
    if((month < 0 || month > 11) || isNaN(month))
    {
      month = new Date().getMonth()
    }
    if(!yearCart.includes(parseInt(year)))
    {
      year = new Date().getUTCFullYear()
    }
  let searchOptions = {}
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/pivots/index', {title:account[0].name, account: account,month:month,year:year, option: "",calculate:"",search:"",bell:"",searchRelative:'',relative:'../../../../',priceStocks:stockPrices,tickerStocks:stockTickers,priceGold:goldData,priceSilver:silverData,god:"saraswatimata",noticount:""});
  //res.send(account)
})
router.get('/:id/chart', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  let searchOptions = {}
  year = new Date().getUTCFullYear()
  month = new Date().getMonth()
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/chart/index', {title:account[0].name, account: account,month:month,year:year, option: "",calculate:"",search:"",bell:"",searchRelative:'',relative:'../../',priceStocks:stockPrices,tickerStocks:stockTickers,priceGold:goldData,priceSilver:silverData,god:"ganeshji",noticount:""});
  
})

router.get('/:id/chart/:year/:month', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  year = req.params.year
    yearCart = []
    count = new Date().getUTCFullYear() - 2021
    for(i = 0;i<=count;i++){
      yearCart.push(new Date().getUTCFullYear()-i)
    }
    month = req.params.month-1
    if((month < 0 || month > 11) || isNaN(month))
    {
      month = new Date().getMonth()
    }
    if(!yearCart.includes(parseInt(year)))
    {
      year = new Date().getUTCFullYear()
    }
  let searchOptions = {}
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/chart/index', {title:account[0].name, account: account,month:month,year:year, option: "",calculate:"",search:"",searchRelative:'',bell:"",relative:'../../../../',priceStocks:stockPrices,tickerStocks:stockTickers,priceGold:goldData,priceSilver:silverData,god:"ganeshji",noticount:""});
  //res.send(account)
})
router.get('/:id/', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
  year = new Date().getUTCFullYear()
  month = new Date().getMonth()
  let searchOptions = {}
  searchOptions._id = req.params.id
  const account = await Account.find(searchOptions)
  notiam = 0
  if(account[0].notification.length != 0)
  {
    let accountUpdate = await Account.findById(req.params.id)
    notiam = 0
    for(i = 0;i < account[0].notification.length;i++)
    {
      if(accountUpdate.notification[i].status == "Off" && accountUpdate.notification[i].tstamp.getDate() == new Date().getDate() && accountUpdate.notification[i].tstamp.getMonth() == new Date().getMonth() && accountUpdate.notification[i].tstamp.getUTCFullYear() == new Date().getUTCFullYear())
      {
        notiam++   
        accountUpdate.notification[i].status = "On"
        account[0].notification[i].status = "On"
        await accountUpdate.save()
      }
      else if(accountUpdate.notification[i].status == "On")
      {
        notiam++
      }
    }
  }
  res.render('account/index', {title:account[0].name, month:month, year:year, account: account,calculate:"../../images/calculator.png", option: "../../images/settings.png" ,search:"../../images/search.png",searchRelative:req.params.id+'/',bell:"🔔",relative:'../',priceStocks:stockPrices,tickerStocks:stockTickers,priceGold:goldData,priceSilver:silverData,god:"ramji",noticount:notiam});
})
router.get('/:id/:year/:month', async (req, res) => {
  let goldData = fs.readFileSync('goldPrice.txt')
  let silverData = fs.readFileSync('silverPrice.txt')
  let stockData = fs.readFileSync('stockData.csv')
  stockData = String(stockData)
  stockData = stockData.split("\r\n")
  stockTickers = []
  stockPrices = []
  stockData.forEach(stock => {
    if(stock != ""){
      value = stock.split(",") 
    stockPrices.push(parseFloat(value[1]))
    stockTickers.push(value[0])
    }
  })
    year = req.params.year
    yearCart = []
    count = new Date().getUTCFullYear() - 2021
    for(i = 0;i<=count;i++){
      yearCart.push(new Date().getUTCFullYear()-i)
    }
    month = req.params.month-1
    if((month < 0 || month > 11) || isNaN(month))
    {
      month = new Date().getMonth()
    }
    x = year
    y = yearCart
    if(!yearCart.includes(parseInt(year)))
    {
      year = new Date().getUTCFullYear()
    }
    let searchOptions = {}
    searchOptions._id = req.params.id
    const account = await Account.find(searchOptions)
    res.render('account/index', {title:account[0].name, month:month, year:year, account: account,calculate:"../../../../images/calculator.png", option: "../../../../images/settings.png",search:"../../../../images/search.png",bell:"🔔",searchRelative:'../../'+req.params.id+'/',relative:'../../../',priceStocks:stockPrices,tickerStocks:stockTickers,priceGold:goldData,priceSilver:silverData,god:"ramji",noticount:""});
  })
  router.put('/', async (req, res) => {
    res.redirect("account/"+req.body.id+"/"+req.body.year+"/"+req.body.month)
  })
  router.put('/chart', async (req, res) => {
    res.redirect(req.body.id+"/chart/"+req.body.year+"/"+req.body.month)
  })
  router.put('/pivots', async (req, res) => {
    res.redirect(req.body.id+"/pivots/"+req.body.year+"/"+req.body.month)
  })
  router.put('/stats', async (req, res) => {
    res.redirect(req.body.id+"/stats/"+req.body.year+"/"+req.body.month)
  })
  router.put('/:id/', async (req, res) => {
    let account = await Account.findById(req.params.id)
    if(req.body.action == 'UpBal')
    {
      account.currbal = req.body.currbal
    await account.save()
    res.redirect(req.params.id)
    }
    else if(req.body.action == 'logout')
    {
      //const logout = spawn('bat', ['./shut_server.bat'])
      //logout.stdout.on('data', function (data) {});
      const logout = spawn('python', ['./shutApp.py'])
      logout.stdout.on('data', function (data) {});
    }
    else if(req.body.action == 'addNot')
    {
      //const categoriesExpense = ["Food","Fuel","Automobile","Donations","Debit","Clothing","Personal Care","Groceries","Entertainment","Investment","Study","Travel","Accomodation","Phone-Internet","House Hold","Health Care", "Present","Loan Repayment"]
      const categoriesIncome = ["Savings","Salary","Interest","Dividend","Asset Liquidation","Gift","Business Payment","Credit","Loan","Cashback-Refund"]
      checkExpense = categoriesIncome.includes(req.body.category)
      actualAmount = (checkExpense?req.body.amount*1.00:req.body.amount*-1.00)
      let newReminder = {title: req.body.title, amount: actualAmount, category: req.body.category,tstamp:req.body.start, description: req.body.description, isexpense: !checkExpense, status: "Off", repeat: req.body.repeat}
      account.notification.push(newReminder)
      await account.save()
      res.redirect(req.params.id)
    }
    else if(req.body.action == 'Settings')
    {
      account.name = req.body.name
      account.dnw = req.body.dnw
      account.aor = req.body.aor
      account.dob= req.body.dob
      account.income -= account.uincome*1.00
      account.expense -= account.uexpense*1.00
      account.income += req.body.uincome*1.00
      account.expense += req.body.uexpense*1.00
      account.uincome = req.body.uincome*1.00
      account.uexpense = req.body.uexpense*1.00
      if(!req.body.state)
      {
        account.isActive = false
        await account.save()
        res.redirect("../../")
      }
      else{
        await account.save()
      res.redirect("../"+req.params.id)
      }
    }
    else if(req.body.action == 'Creatran')
    {
      if(req.body.amount != 0){
        //const categoriesExpense = ["Food","Fuel","Automobile","Donations","Debit","Clothing","Personal Care","Groceries","Entertainment","Investment","Study","Travel","Accomodation","Phone-Internet","House Hold","Health Care", "Present","Loan Repayment"]
        const categoriesIncome = ["Savings","Salary","Interest","Dividend","Asset Liquidation","Gift","Business Payment","Credit","Loan","Cashback-Refund"]
        let account = await Account.findById(req.params.id)
        //let transaction = account.activity
        checkExpense = categoriesIncome.includes(req.body.category)
        actualAmount = (checkExpense?req.body.amount*1.00:req.body.amount*-1.00)
        balance = actualAmount
        if(req.body.category == "Debit" || req.body.category == "Credit")
        {
          balance = 0.00
        }
        let newTransaction = {title: req.body.title, amount: actualAmount, category: req.body.category,tstamp:Date.now(), description: req.body.description, isexpense: !checkExpense, postranbal: ((account.transum+balance+account.onhold)*1.00)}
        account.activity.push(newTransaction)
        account.transum = (account.transum+actualAmount)*1.00
        if(checkExpense && req.body.category != "Credit")
        {
          account.income += req.body.amount*1.00
        }
        if(!checkExpense && req.body.category != "Debit"){

          account.expense += req.body.amount*1.00
        }
        if(req.body.category == 'Debit')
        {
          account.onhold += req.body.amount*1.00
        }
        if(req.body.category == 'Credit')
        {
          account.onhold -= req.body.amount*1.00
        }
        if(req.body.category == 'Loan')
        {
          account.debt += req.body.amount*1.00
        }
        if(req.body.category == 'Loan Repayment')
        {
          account.debt -= req.body.amount*1.00
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
        if(entry.category != "Debit" && entry.category != "Credit"){
          
        if(entry.isexpense){
          account.expense += entry.amount
        }
        else{
          account.income -= entry.amount
        }

        }
        else{
        if(entry.category == "Debit"){
          account.onhold += entry.amount
        }
        if(entry.category == "Credit"){
          account.onhold += entry.amount
        }

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
      currency: req.body.currency,
      minimumFractionDigits: 2
    })
    const account = new Account({
      name: req.body.name,
      transum: req.body.currbal,
      currbal: req.body.currbal,
      income: req.body.currbal,
      currency : req.body.currency,
      //passWord: CryptoJS.createHash('sha256').update(req.body.pass).digest('hex'),
      aor : req.body.aor,
      dnw : req.body.dnw,
      dob : req.body.dob,
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