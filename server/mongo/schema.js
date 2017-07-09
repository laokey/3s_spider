/**
 * Created by laokey on 2017/6/3.
 */

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/3s_spider');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    //console.log('mongodb connection success');
});

var newsSchema = new mongoose.Schema({
        title: String,
        author:String,
        date:Date,
        imageuri:String,
        context:String,
        htmls:String
    },
    {versionKey: false,collection: 'news'});
var newsModel = db.model('news', newsSchema);

exports.newsModel = newsModel;
