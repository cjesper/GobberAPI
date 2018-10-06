var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HashtagSchema = new Schema({
    hashtag : {type: String, unique : true}
});

var Hashtag = mongoose.model('Hashtag', HashtagSchema);

module.exports = Hashtag;

