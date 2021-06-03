// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Import the routing file to handle the default (index) route
var index = require('./routes/app');

// ... ADD CODE TO IMPORT YOUR ROUTING FILES HERE ...
const movieRoutes = require('./routes/movies');

var app = express(); // create an instance of express

// Tell express to use the following parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev')); // Tell express to use the Morgan logger
app.use('/', express.static(path.join(__dirname, "imdb")));

// Add support for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Tell express to use the specified director as the
// root directory for your web site
app.use(express.static(path.join(__dirname, 'dist/imdb')));

// Tell express to map the default route ('/') to the index route
app.use('/', index);

// ... ADD YOUR CODE TO MAP YOUR URL'S TO ROUTING FILES HERE ...
app.use('/movies', movieRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "imdb", "index.html"));
});

// Establish a connection to the mongo database
// mongoose.connect('mongodb://localhost:27017/imdb',
mongoose.connect('mongodb+srv://Silva:ICfj12481632@silvai.llhik.mongodb.net/imdb?retryWrites=true&w=majority',
   {
     useNewUrlParser: true,
     useFindAndModify: false,
     useUnifiedTopology: true
   }, (err, res) => {
      if (err) {
         console.log('Connection failed: ' + err);
      }
      else {
         console.log('Connected to database!');
      }
   }
);

// Tell express to map all other non-defined routes back to the index page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/imdb/index.html'));
});

// Define the port address and tell express to use this port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Tell the server to start listening on the provided port
server.listen(port, function() {
  console.log('API running on localhost: ' + port)
});
