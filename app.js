const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts')
const port = 3000;
const hostname = 'localhost';

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
  res.render('index', {name: 'Prateek'});
})

app.listen(port,hostname, () => { console.log(`Server running at http://${hostname}:${port}/`);});