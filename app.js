const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');
const aboutRouter = require('./routes/about');

// Set the view engine and the views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

// Set up middleware
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(methodOverride('_method'));

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1/ledge', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to the database'));

// Set up routes
app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/about', aboutRouter);

// Start the server
const port = 7000;
const hostname = 'localhost';
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
