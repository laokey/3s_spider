/**
 * Created by laokey on 2017/6/2.
 */

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var db_operator = require('../server/mongo/operator.js');
var schedule = require('node-schedule');
var mongo_news = require('../server/mongo/schema.js');
var moment = require('moment');


var urlUtils = {
    //3snews 首页新闻接口
    taibo: 'http://www.3snews.net/domestic/',
    //上帝之眼
    godeyes: 'http://www.godeyes.cn/list-17-1.html'
}

var clawler = (function () {
    return {
        taibo: function () {
            var options = {
                url: urlUtils.taibo,
                headers: {
                    'User-Agent': 'request',
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                }//伪造请求头  
            };
            request(options, function (err, response, body) {
                //获取最新新闻
                var $ = cheerio.load(body);
                $('.media').each(function (index, content) {
                    var title, imguri;
                    async.waterfall([
                        function (callback) {
                            title = $(content).find('.index_list2 h2 a').attr('title');
                            imguri = $(content).find('.imgwrap img').attr('src');
                            var detail_uri = $(content).find('.imgwrap a').attr('href');
                            callback(null, detail_uri);
                        },
                        function (uri, callback) {
                            //获取正文内容
                            request(uri, function (detail_err, detail_response, detail_body) {
                                var $$ = cheerio.load(detail_body);

                                var text = $$('.maintext').text().trim();
                                var htmls = $$('.maintext').html().toString();
                                var author = $$('.author_date').text().split('•');
                                var news_json = {
                                    title: title,
                                    author: author[0],
                                    date: author[1],
                                    imageuri: imguri,
                                    context: text,
                                    htmls: htmls
                                }
                                callback(null, news_json);
                            })
                        },
                        function (json, callback) {
                            db_operator.createDoc(json);
                            callback(null, '---正在爬取泰伯网新闻---');
                        }
                    ], function (err, msg) {
                        console.log(msg);
                    })
                })
            })
        },
        godeyes: function () {
            var options2 = {
                url: urlUtils.godeyes,
                headers: {
                    "Proxy-Connection":"keep-alive",
                    "cookie":"safedog-flow-item=AED45557C20906F49331110D8222936D; bdshare_firstime=1499061459502; __utma=229896970.684694498.1499061755.1499061755.1499061755.1; __utmz=229896970.1499061755.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); Hm_lvt_28b4069f0178ca93febda88b9d879515=1499061755; Hm_lvt_fc40f074540ee4451b40e29b783fd15c=1498790561,1499061445,1499067124; Hm_lpvt_fc40f074540ee4451b40e29b783fd15c=1499067939",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Referer":"http://www.godeyes.cn/?WebShieldSessionVerify=kfFm932RJaFC2iD82nD3",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                }//伪造请求头
            };
            request(options2, function (err, resopnse, body) {
                var $ = cheerio.load(body);
                $('.channeltabcon dl').each(function (index, content) {
                    var title, imguri;
                    async.waterfall([
                        function (callback) {
                            title = $(content).find('dt a').attr('title');
                            imguri = 'http://www.godeyes.cn/' + $(content).find('dt img').attr('src');
                            var detail_uri = 'http://www.godeyes.cn/' + $(content).find('dd h3 a').attr('href');
                            callback(null, detail_uri);
                        },
                        function (uri, callback) {
                            //获取正文内容
                            request(uri, function (detail_err, detail_response, detail_body) {
                                var $$ = cheerio.load(detail_body);

                                var text = $$('.con_neir').text().trim();
                                var htmls = $$('.con_neir').html().toString();
                                var date = $$('.tit p span').text().toString();
                                var author = $$('.tit p span i').text().toString();
                                date = new Date(date.substring(0, date.indexOf('来源')));

                                var news_json = {
                                    title: title,
                                    author: author,
                                    date: date,
                                    imageuri: imguri,
                                    context: text,
                                    htmls: htmls
                                }
                                callback(null, news_json);
                            })
                        },
                        function (json, callback) {
                            db_operator.createDoc(json);
                            callback(null, '---上帝之眼新闻爬取中---');
                        }
                    ], function (err, msg) {
                        console.log(msg);
                    })
                })
            })
        }
    }
})()


var rule = new schedule.RecurrenceRule();
rule.hour = 9;
var j = schedule.scheduleJob(rule, function () {
    clawler.taibo();
    clawler.godeyes();
});

clawler.taibo();
clawler.godeyes();









