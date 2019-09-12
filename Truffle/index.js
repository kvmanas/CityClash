var express = require('express');
var path = require('path');
var cors = require('cors');
var app = express();

app.use(cors());
app.get('/', function(req, res) {
  res.send('truffle service working...');
});
app.use('/contracts', express.static(path.join(__dirname, 'build/contracts')));
app.listen(3010);
