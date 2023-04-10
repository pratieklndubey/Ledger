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
  try {
    const goldData = fs.readFileSync('goldPrice.txt');
    const silverData = fs.readFileSync('silverPrice.txt');
    let stockData = fs.readFileSync('stockData.csv', 'utf8').split('\r\n');
    const stockTickers = [];
    const stockPrices = [];

    stockData.forEach(stock => {
      if (stock !== '') {
        const [ticker, price] = stock.split(',');
        stockPrices.push(parseFloat(price));
        stockTickers.push(ticker);
      }
    });

    const searchOptions = {_id: req.params.id};
    const account = await Account.find(searchOptions);

    const date = new Date();
    const options = {
      month: date.getMonth(),
      year: date.getFullYear(),
      option:'',
      title: account[0].name,
      page: '| Search',
      account: account,
      relative: '../../../',
      search: '',
      calculate: '',
      bell: '',
      searchRelative: '',
      god: 'hanumanji',
      noticount: '',
      priceGold: goldData,
      priceSilver: silverData,
      priceStocks: stockPrices,
      tickerStocks: stockTickers,
    };

    res.render('account/search/index', options);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

router.get('/:id/search/result/:query', async (req, res) => {
  try {
    const goldData = fs.readFileSync('goldPrice.txt', 'utf-8');
    const silverData = fs.readFileSync('silverPrice.txt', 'utf-8');
    let stockData = fs.readFileSync('stockData.csv', 'utf-8');
    const matchCriteria = /(?<=\[).*?(?=\])/;
    const stockDataArray = stockData.split('\r\n').filter(stock => stock !== '');
    const stockPrices = stockDataArray.map(stock => parseFloat(stock.split(',')[1]));
    const stockTickers = stockDataArray.map(stock => stock.split(',')[0]);
    const searchOptions = {_id: req.params.id};
    const account = await Account.find(searchOptions);
    const values = req.params.query.split('+');
    const title = values[0];
    const description = values[1];
    const category = values[2];
    const from = values[3] === '' ? new Date(account[0].tcreate) : new Date(values[3] + ' UTC');
    const to = values[4] === '' ? new Date() : new Date(values[4] + ' UTC');
    to.setDate(to.getDate() + 1);
    const matchCriteriaTitle = `^.*?${title}.*?$`;
    const matchCriteriaDescription = `^.*?${description}.*?$`;
    const result = [];
    let sum = 0;
    account[0].activity.filter(record =>
      record.isActive &&
      ((category !== 'All Expenses' && category !== 'All Incomes') ? true : (category === 'All Expenses' ? record.isexpense : !record.isexpense)) &&
      (values[3] === '' ? true : record.tstamp > from) &&
      (values[4] === '' ? true : record.tstamp < to) &&
      ((category === 'All Transactions' || category === 'All Expenses' || category === 'All Incomes') ? true : record.category === category) &&
      (description === '' ? true : record.description.match(matchCriteriaDescription)) &&
      (title === '' ? true : record.title.match(matchCriteriaTitle))
    ).forEach(record => {
      result.push(record);
      sum += record.amount;
    });
    res.render('account/search/result/index', {
      page: '| Search Result',
      tranType: category,
      totalAmount: sum,
      searchto: to,
      searchfrom: from,
      result: result,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      option: '',
      title: account[0].name,
      account: account,
      relative: '../../../../',
      search: '',
      calculate: req.params.query,
      bell: '',
      searchRelative: '',
      god: 'hanumanji',
      noticount: '',
      priceGold: goldData,
      priceSilver: silverData,
      priceStocks: stockPrices,
      tickerStocks: stockTickers
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/:id/assets', async (req, res) => {
  const goldData = fs.readFileSync('goldPrice.txt', 'utf8');
  const silverData = fs.readFileSync('silverPrice.txt', 'utf8');
  let stockData = fs.readFileSync('stockData.csv', 'utf8').split('\r\n').filter(Boolean);
  const stockTickers = [];
  const stockPrices = [];
  
  stockData.forEach(stock => {
    const [ticker, price] = stock.split(',');
    stockTickers.push(ticker);
    stockPrices.push(parseFloat(price));
  });

  const searchOptions = { _id: req.params.id };
  const account = await Account.find(searchOptions);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  res.render('account/assets/index', {
    page: '| Assets',
    title: account[0].name,
    account,
    month,
    year,
    option: '',
    calculate: '',
    search: '',
    bell: '',
    searchRelative: '',
    relative: '../../',
    priceGold: goldData,
    priceSilver: silverData,
    priceStocks: stockPrices,
    tickerStocks: stockTickers,
    god: 'krishnaji',
    noticount: '',
  });
});

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

router.get('/:id/story', async (req, res) => {
  const goldData = fs.readFileSync('goldPrice.txt');
  const silverData = fs.readFileSync('silverPrice.txt');
  const stockData = fs.readFileSync('stockData.csv').toString().split('\r\n');
  const stockTickers = [];
  const stockPrices = [];
  stockData.forEach(stock => {
    if (stock !== '') {
      const value = stock.split(',');
      stockPrices.push(parseFloat(value[1]));
      stockTickers.push(value[0]);
    }
  });

  const searchOptions = {
    _id: req.params.id
  };

  const account = await Account.find(searchOptions);

  res.render('account/story/index', {
    page: '| story',
    title: account[0].name,
    account,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    option: '',
    calculate: '',
    search: '',
    bell: '',
    searchRelative: '',
    relative: '../../',
    priceStocks: stockPrices,
    tickerStocks: stockTickers,
    priceGold: goldData,
    priceSilver: silverData,
    god: 'laxmimata',
    noticount: '',
  });
});

router.get('/:id/pivots', async (req, res) => {
  try {
    const goldData = fs.readFileSync('goldPrice.txt', 'utf8');
    const silverData = fs.readFileSync('silverPrice.txt', 'utf8');
    let stockData = fs.readFileSync('stockData.csv', 'utf8');
    stockData = stockData.split('\r\n').filter(stock => stock !== '');
    const stockTickers = [];
    const stockPrices = [];
    stockData.forEach(stock => {
      const [ticker, price] = stock.split(',');
      stockTickers.push(ticker);
      stockPrices.push(parseFloat(price));
    });
    const searchOptions = { _id: req.params.id };
    const account = await Account.find(searchOptions);
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    res.render('account/pivots/index', {
      page: '| Pivots',
      title: account[0].name,
      account,
      month,
      year,
      option: '',
      calculate: '',
      search: '',
      bell: '',
      searchRelative: '',
      relative: '../../',
      priceStocks: stockPrices,
      tickerStocks: stockTickers,
      priceGold: goldData,
      priceSilver: silverData,
      god: 'saraswatimata',
      noticount: ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/:id/chart', async (req, res) => {
  try {
    const goldData = fs.readFileSync('goldPrice.txt', 'utf8');
    const silverData = fs.readFileSync('silverPrice.txt', 'utf8');
    let stockData = fs.readFileSync('stockData.csv', 'utf8');
    stockData = stockData.split('\r\n').filter(stock => stock !== '');
    const stockTickers = [];
    const stockPrices = [];
    stockData.forEach(stock => {
      if (stock !== '') {
        const [ticker, price] = stock.split(',');
        stockTickers.push(ticker);
        stockPrices.push(parseFloat(price));
      }
    });
    const searchOptions = { _id: req.params.id };
    const account = await Account.find(searchOptions);
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    res.render('account/chart/index', {
      page: '| Charts',
      title: account[0].name,
      account,
      month,
      year,
      option: '',
      calculate: '',
      search: '',
      bell: '',
      searchRelative: '',
      relative: '../../',
      priceStocks: stockPrices,
      tickerStocks: stockTickers,
      priceGold: goldData,
      priceSilver: silverData,
      god: 'ganeshji',
      noticount: ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/:id/', async (req, res) => {
  try {
    const goldData = fs.readFileSync('goldPrice.txt', 'utf8');
    const silverData = fs.readFileSync('silverPrice.txt', 'utf8');
    let stockData = fs.readFileSync('stockData.csv', 'utf8');
    stockData = stockData.split('\r\n').filter(stock => stock !== '');
    const stockTickers = [];
    const stockPrices = [];
    stockData.forEach(stock => {
      if (stock !== '') {
        const [ticker, price] = stock.split(',');
        stockTickers.push(ticker);
        stockPrices.push(parseFloat(price));
      }
    });
    const searchOptions = { _id: req.params.id };
    const account = await Account.find(searchOptions);
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const notiam = 0;
    res.render('account/index', {
      page: '',
      title: account[0].name,
      month,
      year,
      account,
      calculate: '../../images/calculator.png',
      option: '../../images/settings.png',
      search: '../../images/search.png',
      searchRelative: `${req.params.id}/`,
      bell: '🔔',
      relative: '../',
      priceStocks: stockPrices,
      tickerStocks: stockTickers,
      priceGold: goldData,
      priceSilver: silverData,
      god: 'ramji',
      noticount: notiam
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/', async (req, res) => {
  switch (req.body.action) {
    case 'logout':
      const logout = spawn('python', ['./shutApp.py'])
      logout.stdout.on('data', function (data) {});
      break;
    default:
      res.redirect(`account/${req.body.id}`);
  }
});

router.put('/chart', async (req, res) => {
  res.redirect(`${req.body.id}/chart`);
});

router.put('/pivots', async (req, res) => {
  res.redirect(`${req.body.id}/pivots`);
});

router.put('/story', async (req, res) => {
  res.redirect(`${req.body.id}/story`);
});

  
    
  router.put('/:id/', async (req, res) => {
    let account = await Account.findById(req.params.id)
    if(req.body.action == 'UpBal')
    {
      account.currbal = req.body.currbal
    await account.save()
    res.redirect(req.params.id)
    }
    
    else if(req.body.action == 'addNot')
    {
  const categoriesIncome = ["Savings","Salary","Interest","Dividend","Asset Liquidation","Gift","Business Payment","Loan","Rebate"]//,"Credit"
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
        const categoriesIncome = ["Savings","Salary","Interest","Dividend","Asset Liquidation","Gift","Business Payment","Loan","Rebate"]
        let account = await Account.findById(req.params.id)
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
        await account.save()
        res.redirect("../"+req.params.id)
      }
      }
  
  })

router.put('/:id/:tid', async (req, res) => {
    let pageDirect;
    if (req.body.action === 'Update') {
      if (req.body.amount !== 0) {
        const account = await Account.findById(req.params.id);
        const transaction = account.activity;
        const entry = transaction.find((entry) => entry._id === req.params.tid);
        entry.description = req.body.description;
        entry.title = req.body.title;
        entry.category = req.body.category;
        await account.save();
        pageDirect = `../${req.params.id}`;
      }
    } else if (req.body.action === 'SearchUpdate') {
      if (req.body.amount !== 0) {
        const account = await Account.findById(req.params.id);
        const transaction = account.activity;
        const entry = transaction.find((entry) => entry._id === req.params.tid);
        entry.description = req.body.description;
        entry.title = req.body.title;
        entry.category = req.body.category;
        await account.save();
        pageDirect = `../${req.params.id}/search/result/${req.body.pageid}`;
      }
    }
    res.redirect(pageDirect);
});

router.post('/', async (req, res) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: req.body.currency,
    minimumFractionDigits: 2
  });

  const account = new Account({
    name: req.body.name,
    transum: req.body.currbal,
    currbal: req.body.currbal,
    income: req.body.currbal,
    currency: req.body.currency,
    aor: req.body.aor,
    dnw: req.body.dnw,
    dob: req.body.dob,
    activity: [{
      title: 'Opening Balance',
      amount: req.body.currbal,
      category: 'Savings',
      isexpense: false,
      postranbal: req.body.currbal,
      description: `Opened account with ${formatter.format(req.body.currbal)}`
    }]
  });

  const newAccount = await account.save();
  res.redirect(`account/${account._id}`);
});

module.exports = router