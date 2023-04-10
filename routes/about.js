const express = require('express');
const router = express.Router();

const getAboutPage = async (req, res) => {
  try {
    res.render('about/index', {
      page: '',
      title: 'About',
      relative: '../',
      option: '',
      search: '',
      bell: '',
      searchRelative: '',
      calculate: '',
      god: 'shivaji',
      noticount: '',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

router.get('/', getAboutPage);

module.exports = router;
