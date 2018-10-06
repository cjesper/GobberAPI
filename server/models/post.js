var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    nick : String,
    text : String,
    unique_id : String,
    timeStamp : Number,
    color: {type: String, default: "blue" },
    Gvotes : Number,
    Jvotes : Number,
    hash_tags : [String],
    img: 
        {data: Buffer, contentType: String}
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;

