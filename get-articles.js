
var FeedParser = require('feedparser')
  , domain = require('domain')
  , mongoose = require('mongoose')
  , request = require('request')
  , feeds = require('./feeds').feeds;

var startDate = +new Date();

var parseFeed = function(i) {
  
  if (i<0) { 
    var time = ((+new Date()-startDate)/1000)|1;
    console.log("Finished for %s seconds", time);
    return; 
  }

  var feed = feeds[i];
  console.log('..... %s .....', feed);

  request({
    url: feed,
    timeout: 5000
  }, function(err) {
    if (err) {
      console.log('request error');
      parseFeed(--i);
    }
  })
  .pipe(new FeedParser())
  .on('error', function(error) {
    console.log('feed error');
  })
  .on('meta', function (meta) {
    console.log('===== %s =====', meta.title);
  })
  .on('readable', function () {
    var stream = this, item;
    while (item = stream.read()) {
      console.log('%s Got article: %s', item.date, item.title || item.description);
    }
  })
  .on('end', function () {
    parseFeed(--i);
  })
};

parseFeed(feeds.length-1);