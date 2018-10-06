var express = require('express');
var router = express.Router();

//Internal packages
var Comment = require('../models/comment');

/* GET users listing. */
router.post('/', function(req, res, next) {

    Comment.find({parentID : req.body.id}
      ).sort({ timeStamp: -1})
        .exec(function (err, result) {
          if (err) {
            res.send(err);
            throw err;
          } else {
              res.send(result);
        }
    });
});

module.exports = router;


