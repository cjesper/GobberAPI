require('dotenv').load();

var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var socketIO = require('socket.io');
var axios = require('axios');
var qs = require('qs');
var cors = require('cors');
var multer = require('multer');
var cloudinary = require('cloudinary');

var index = require('./routes/index');
var posts = require('./routes/posts');
var newpost = require('./routes/newpost');
var updatepost = require('./routes/updatePost');
var newcomment = require('./routes/newcomment')
var fetchcomments = require('./routes/fetchcomments');
var newimage = require('./routes/newimage');
var fetchimages = require('./routes/fetchimages');
var fetchhashtags = require('./routes/fetchhashtags');
var authorize = require('./routes/authorize');
var logincallback = require('./routes/logincallback');

var WebSocket = require('./websocket');
var remote_url = 'mongodb://localhost:27017/gobblogg';

var app = express();
app.use(cors());
WebSocket.init(app);
var port = (process.env.PORT || 4001);

cloudinary.config({
    cloud_name : "gobblog",
    api_key : process.env.api_key,
    api_secret : process.env.api_secret
})


var Post = require('./models/post');
  mongoose.connect(remote_url, function (err, db) {
    if (err) {
      console.log("Unable to connect to remote server.");
    } else {
      console.log("Connection established!", remote_url);
    }
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(cors({ origin: '*', credentials: true }));

app.use('/', index);
app.use('/posts', posts);
app.use('/newpost', newpost);
app.use('/updatepost', updatepost);
app.use('/', express.static('build'));
app.use('/newcomment', newcomment);
app.use('/newimage', newimage);
app.use('/fetchcomments', fetchcomments);
app.use('/fetchimages', fetchimages);
app.use('/fetchhashtags', fetchhashtags);
app.use('/authorize', authorize);
app.use('/logincallback', logincallback);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //req.headers.origin = req.headers.origin || req.headers.host; 
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

/* Initiate server */
let 
    sequenceNumberByClient = new Map();

WebSocket.listen(port, () => {
    console.log("Running on " + port);
    WebSocket.on('connection', (socket) => {
    console.log("New connection from " + socket.id);
    sequenceNumberByClient.set(socket, 1);
        Post.
            find()
            .sort({timeStamp: -1})
            .exec((err, posts) => {
            if (err) {
                console.log(err);
                throw err;
            }
            socket.emit('allPosts', posts); 
        });
        socket.on('postRequest', (socket) => {
            console.log("Posts requested.");
            Post.find({})
                .sort({ timeStamp: -1})
                .exec((err, posts) => {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    WebSocket.emit_to_client(socket, 'allPosts', posts);
                }
            });

        })
    });
});

module.exports = app;
