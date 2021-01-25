const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts')
const port = 3000;
const hostname = 'localhost';

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static(__dirname+'/public'));

app.use('/', indexRouter)

app.listen(port,hostname, () => { console.log(`Server running at http://${hostname}:${port}/`);});