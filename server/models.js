var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  nick : String,
  text : String,
  timeStamp : Date,
  color: {type: String, default: "blue" }
});

var PostModel = mongoose.model('PostModel', PostSchema);

module.exports = {
  PostModel: PostModel
} 
