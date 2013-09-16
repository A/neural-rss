'use strict';

var startDate = +new Date()
  , FeedParser = require('feedparser')
  , domain = require('domain')
  , mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://localhost/test')
  , uniqueValidator = require('mongoose-unique-validator')
  , request = require('request')
  , feeds = require('./feeds').feeds
  , articleSchema = mongoose.Schema(require('./article-schema')),
  Article = mongoose.model('article', articleSchema.plugin(uniqueValidator, { mongoose: mongoose }));


var parseFeed = function(i) {
  
  if (i<0) { 
    var time = ((+new Date()-startDate)/1000)|1;
    console.log("Finished for %s seconds", time);
    return; 
  }

  var feed = feeds[i];
  console.log(' ');
  console.log('..... %s .....', feed);

  request({
    url: feed,
    timeout: 5000
  }, function(err) {
    if (err) {
      console.log('> request error');
      parseFeed(--i);
    }
  })
  .pipe(new FeedParser())
  .on('error', function(error) {
    console.log('> feed error');
  })
  .on('meta', function (meta) {
    console.log('===== %s =====', meta.title);
  })
  .on('readable', function () {
    var stream = this, item;
    while (item = stream.read()) {
      console.log('> %s Got article: %s', item.date, item.title || item.description);
      saveArticle(item);
    }
  })
  .on('end', function () {
    parseFeed(--i);
  })
};


var saveArticle = function (content) {
  if (typeof content !== 'object') { return; }
  var article = new Article(content);
  console.log('>> saving')

  article.save(function (err) {
    if (err && err.errors && err.errors.guid && err.errors.guid.type==='unique') { console.log('>> article already saved'); return; }// ...
    console.log('>> saved');
  });

};

var getArticles = function() {
  parseFeed(feeds.length-1);
};

getArticles();