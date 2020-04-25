var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var cloudinary = require('cloudinary');
const uuidv4 = require('uuid/v4');

const storage = multer.diskStorage({
  destination: './files',
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
  },
});

const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed.'), false);
  }
  cb(null, true);
}; 

var upload = multer({ dest: 'uploads/'});
//Internal packages
var Post = require('../models/post');
var WebSocket = require('../websocket');
var Hashtag = require('../models/hashtag');

function getRandColor () {
    var colors = ["#ff66cc", "#3399ff","#33cc33", "#ff9900", "#993399", "#0033cc"];
    return colors[Math.floor(Math.random() * colors.length)];
} 

/* Add a new post */
router.post('/', upload.single('pic') , function(req, res, next) {
    try {
        var provided_nick = req.body.nick;
        var provided_text= req.body.text;
        var sender = req.body.socket_id;
        var unique_id = uuidv4();
        var provided_image = req.body.img;
        var chosen_color = getRandColor(); 
        var ts = Date.now() / 1000;
        var hashtags = [];

        // Stuff for image 
        var upload = require('cloudinary').uploader.upload; 
        if (req.file) { 
        upload(req.file.path, function (result) {
          if (result.error) {
            console.log("error here");
            console.log(result.error.message);
            res.send("not okay..");
          } else {
            console.log(result);
            var word_list = provided_text.split(' ');
            // Extract hashtags 
            for (var i = 0; i < word_list.length; i ++) {
                if (word_list[i][0] == "#") {
                    hashtags.push(word_list[i].substring(1));
                }
            }
            if (hashtags != []) {
                for (var i = 0; i < hashtags.length; i++) {
                    console.log(hashtags);
                    Hashtag.update(
                      {hashtag : hashtags[i]},
                      {hashtag : hashtags[i]},
                      {upsert: true, new: true},
                      function (err, result) {
                        if (!err) {
                          console.log(result);
                        }
                        } 
                    )
                }
            }

            Post.update(
                {unique_id : unique_id},
                {nick: provided_nick,
                  text: provided_text,
                  img : result.url,
                  color: chosen_color,
                    hash_tags : hashtags,
                  timeStamp : ts},
                  {upsert: true, new:true},
                  function (err, result) {
                    if (!err) {
                        res.send(result); 
                        Post.find({})
                            .sort({ timeStamp: -1})
                            .exec((err, posts) => {
                            if (err) {
                                console.log(err);
                                throw err;
                            } else {
                                WebSocket.emit_to_client(sender, 'allPosts', posts);
                                WebSocket.emit('newPosts', sender);
                            }
                        });
                    } else {
                        console.log(err.message);
                        res.send(err); 
                    }
                  } 
              );
          }
        });
        } else {
          console.log("no file specified!")
            var word_list = provided_text.split(' ');
            // Extract hashtags 
            for (var i = 0; i < word_list.length; i ++) {
                if (word_list[i][0] == "#") {
                    hashtags.push(word_list[i].substring(1));
                }
            }
            if (hashtags != []) {
                for (var i = 0; i < hashtags.length; i++) {
                    console.log(hashtags);
                    Hashtag.update(
                      {hashtag : hashtags[i]},
                      {hashtag : hashtags[i]},
                      {upsert: true, new: true},
                      function (err, result) {
                        if (!err) {
                          console.log(result);
                        }
                        } 
                    )
                }
            }
            Post.update(
                {unique_id : unique_id},
                  {nick : provided_nick,
                  text: provided_text,
                  color: chosen_color,
                  hash_tags : hashtags,
                  timeStamp : ts},
                  {upsert: true, new:true},
                  function (err, result) {
                    if (!err) {
                        res.send(result); 
                        Post.find({})
                            .sort({ timeStamp: -1})
                            .exec((err, posts) => {
                            if (err) {
                                console.log(err);
                                throw err;
                            } else {
                                WebSocket.emit_to_client(sender, 'allPosts', posts);
                                WebSocket.emit('newPosts', sender);
                                console.log("Emitted!")
                            }
                        });
                    } else {
                        console.log(err.message);
                        res.send(err); 
                    }
                  } 
              );
          }
    } catch (err) {
      console.log(err);
    }
 });

module.exports = router;
    
    
