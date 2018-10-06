var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var cloudinary = require('cloudinary');

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
var Image = require('../models/image');
var Post = require('../models/post');

/* Add a new image*/
router.post('/', upload.single('pic') , function(req, res, next) {
    try {
    console.log(req.body);
    console.log(req.file);
    const provided_image = req.file;
    var upload = require('cloudinary').uploader.upload; 

    upload(req.file.path, function (result) {
      if (result.error) {
        console.log("error here");
        console.log(result.error.message);
        res.send("not okay..");
      } else {
        console.log(result);
        console.log("i also got here!!");
        Post.update(
            {},
            {img : result.url},
            {upsert: true, new: true},
              function (uptPost, err) {
                if (!err) {
                  console.log(uptPost);
                } else {
                  console.log(err);
                }
          });
        res.send("okay");
      }
    })
    } catch (err) {
      console.log(err);
    }
})

module.exports = router;

