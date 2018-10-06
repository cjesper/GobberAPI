var express = require('express');
var router = express.Router();

//Internal packages
var Image = require('../models/image');

/* GET users listing. */
router.get('/', function(req, res, next) {
    Image.find({}
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
