/**
 * Created by laokey on 2017/6/4.
 */

var mongo_news=require('./schema.js');

exports.createDoc=function(json,callback){
    var title=json.title;
    mongo_news.newsModel.find({title:title},function(err,news){
        if(news.length){
            //已存在该新闻，不创建
        }else{
            mongo_news.newsModel.create(json,callback);
        }
    })
}
