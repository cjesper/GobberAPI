var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    post_id : String,
    img_src : String,
    img: 
        {data: Buffer, contentType: String}
});

var Image = mongoose.model('Image', ImageSchema);

module.exports = Image;

