var express = require('express');
var router = express.Router();

//Internal packages
var Post = require('../models/post');

/* GET users listing. */
router.get('/', function(req, res, next) {
    
    // If no query was specified
    if (!req.query.hashtag) {
        Post.find(
            {}
          ).sort({ timeStamp: -1})
            .exec(function (err, result) {
              if (err) {
                res.send(err);
                throw err;
              } else {
                  res.send(result);
            }
        });
    } else {
      console.log("Got a query");
      console.log(req.query.hashtag)
        Post.find(
            {hash_tags : req.query.hashtag}
          ).sort({ timeStamp: -1})
            .exec(function (err, result) {
              if (err) {
                res.send(err);
                throw err;
              } else {
                  res.send(result);
            }
        });
    }
});

module.exports = router;


