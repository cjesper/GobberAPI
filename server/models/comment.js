var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    parentID : String,
    nick : String,
    text : String,
    timeStamp : Number,
    color: {type: String, default: "blue" },
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

