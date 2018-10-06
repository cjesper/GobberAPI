var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Internal packages
var Comment = require('../models/comment');
var WebSocket = require('../websocket');

/* Add a new comment to specified post */
router.post('/', function(req, res, next) {
    console.log(req.body);
    var id = req.body.id;
    var comment = req.body.comment;
    var nick = "anon";
    var timeStamp = Date.now() / 1000;
    if (req.body.nick) {
      nick = req.body.nick;
    }
    console.log(comment);

    Comment.update(
            {parentID : "awdihwaihdwahidwahidwaihdihawdihwadhiadhiada"}, 
            {
              parentID : id,
              nick : nick,
              text : comment,
              timeStamp : timeStamp},
              {upsert: true, new: true},
              (err, comments) => {
                  if (err) {
                    console.log(err);
                    throw err;
                  } else {
                    console.log(comments); 
                  }
            })
});

module.exports = router;
