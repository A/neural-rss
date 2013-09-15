'use strict';
var mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://localhost/test')
  , articleScheme = require('../../article-schema')
  , articles = mongoose.model('article', articleScheme);

module.exports = function(app) {
  app.get('/', function(req, res) {

    articles
    .find({}, 'title')
    .sort({date: -1})
    .execFind(function (err, docs) {
      var buf = [];
      for (var key in docs) {
        buf.push(docs[key]['title']||'')
      }
      var response = buf.join('\r\n');
      res.end(response);
    });

    // res.render('index', {
    //   title: 'reader',
    //   articles: __articles
    // });
  });
};