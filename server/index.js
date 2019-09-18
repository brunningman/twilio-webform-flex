const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/router.js');
const path = require('path');
const morgan = require('morgan');

// create express server
const app = express();

// initialize middleware
app.use('/messages', bodyParser.urlencoded({extended: false}));
app.use('/messages/send', bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use(morgan('tiny'));

app.use(routes);

app.listen(process.env.port || 3000, () => {
  console.log(`listening for requests on port ${process.env.port || 3000}`);
});