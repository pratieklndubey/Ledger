const express = require('express');
const app = express();
const port = 3000;
hostname = 'localhost';

// Define the static file path
app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.listen(port,hostname, () => { console.log(`Server running at http://${hostname}:${port}/`);});