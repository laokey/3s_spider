#3s_crawler | 3s爬虫
####3s information crawler edit by Node.js
___
### 概述：
> "3S"技术是英文遥感技术（Remote Sensing RS）、地理信息系统（Geographical information System GIS）、全球定位系统（Global Positioning System GPS）这三种技术名词中最后一个单词字头的统称。三者构成狭义的地理信息技术，也是广义地理信息技系统的核心。

使用Node.js写的爬虫程序，定向爬取3s相关网站信息，完成以下目标：
* 3s网站包括（[泰伯网] (http://www.3snews.net/)、[上帝之眼](http://www.godeyes.cn/)、[国家测绘局](http://www.sbsm.gov.cn/)、[gis空间站](http://www.gissky.net/)、ENVI blog、ArcGIS blog）,支持后期添加扩展
* 可自定义关键词，对指定内容进行爬取
* 可自定义爬虫程序启动时间及执行频率
* 可将文章标题、图片、来源、内容等信息存入数据库或导出本地文件

### 技术选型：
* [request](https://github.com/request/request):模拟http请求等操作
* [cheerio](https://github.com/cheeriojs/cheerio):JQuery方式操作DOM




