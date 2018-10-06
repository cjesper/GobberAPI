var express = require('express');
var router = express.Router();

//Internal packages
var Hashtag = require('../models/hashtag');

/* GET users listing. */
router.get('/', function(req, res, next) {
    Hashtag.find({})
      .select('hashtag -_id')
      .exec(function (err, result) {
          if (err) {
            res.send(err);
            throw err;
          } else {
            console.log(result);
            res.send(result);
        }
    });
});

module.exports = router;
