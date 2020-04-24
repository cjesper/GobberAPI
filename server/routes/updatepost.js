var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var WebSocket = require('../websocket');

//Internal packages
var Post = require('../models/post');

/* Update a post */
router.post('/', function(req, res, next) {
    var upvote_J = req.body.Jvotes; 
    var upvote_G = req.body.Gvotes; 
    var provided_id = req.body.id;
	console.log(req.body)
    Post.update(
        {
          _id : provided_id},
          {
            Gvotes : upvote_G,
            Jvotes : upvote_J
          },
          {new:true},
          function (err, result) {
            if (!err) {
                res.send(result); 
            } else {
                console.log(err.message);
                res.send(err); 
            }
          } 
      );
});

module.exports = router;
