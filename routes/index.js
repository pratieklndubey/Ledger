const express = require('express');
const router = express.Router();
const Account = require('../models/account');

const getHomePage = async (req, res) => {
  try {
    const account = await Account.find();
    res.render('index', {
      page: '',
      title: 'Home',
      newaccount: new Account(),
      account: account,
      calculate: '',
      option: '',
      search: '',
      bell: '',
      relative: '',
      searchRelative: '',
      god: 'durgamata',
      noticount: '',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

router.get('/', getHomePage);

module.exports = router;
