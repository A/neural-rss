'use strict';
var mongoose = require('mongoose')
  , moment = require('moment')
  , db = mongoose.connect('mongodb://localhost/test') && mongoose.connection
  , articleScheme = require('../../article-schema')
  , articles = mongoose.model('article', articleScheme);

// log db connection
db.on('error', function (err) {
  console.log('connection error:', err.message);
});
db.once('open', function callback () {
  console.log("Connected to DB!");
});


module.exports = function(app) {
  app.get('/', function(req, res) {

    articles
      .find({}, 'title link date')
      .sort({date: -1})
      .execFind(function (err, items) {
        res.render('index', {items: items, moment: moment});
      });
  });

  // В http://expressjs.com/api.html#app.VERB хороший пример для размышлений с middleware. Здесь можно использовать middleware загрузки статей
  app.get('/id/:id', function(req, res) {

    articles
      .find({_id: req.params.id}, function (err, article) {
        article = article[0] // http://stackoverflow.com/questions/9931531/jade-template-with-variables-nodejs-server-side
        res.render('article', {article: article});
      });

  });
};