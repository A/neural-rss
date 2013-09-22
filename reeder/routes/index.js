'use strict';
var mongoose = require('mongoose')
  , moment = require('moment')
  , db = mongoose.connect('mongodb://localhost/test') && mongoose.connection
  , articleSchema = require('../../article-schema')
  , classifierSchema = require('../../classifier-schema')
  , articles = mongoose.model('article', articleSchema)
  , classifiers = mongoose.model('classifier', classifierSchema)
  , natural = require('natural');

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

    getArtigle(req.params.id, function (err, article) {
      res.render('article', {article: article});
    });

  });

  app.get('/label/:label/:id', function(req, res) {
    
    // Отправляем пользвателя на главную
    res.redirect('/');

    var user = 'a8h333';

    getArtigle(req.params.id, function (err, article) {
      getClassifier(user, function (err, classifier) {

        var document = article.summary || article.description;
        var label = req.params.label;
        // console.log(document, label)
        classifier.addDocument(document, label);
        classifier.train();
        saveClassifier(user, classifier);
      });
    });

  });

};







var getArtigle = function(id, callback) {
    articles
    .find({_id: id}, function (err, article) {
      article = article && article[0] // http://stackoverflow.com/questions/9931531/jade-template-with-variables-nodejs-server-side
      callback(err, article);
    });
};


var getClassifier = function(user, callback) {

    classifiers
    .find({user: user}, function (err, classifier) {

      // console.log(classifier)
      classifier = classifier && classifier[0]; // http://stackoverflow.com/questions/9931531/jade-template-with-variables-nodejs-server-side

      var __classifier;

      if (typeof classifier === 'undefined') {
        // console.log('classifier is undefined');
        __classifier = new natural.BayesClassifier(natural.PorterStemmerRu);
      } else {
        console.log('classifier restored');
        // console.log(classifier);
        __classifier = natural.BayesClassifier.restore(JSON.parse(classifier.data));
      }

      callback(err, __classifier);

    });
};


var saveClassifier = function(user, classifier) {
  
  var data = JSON.stringify(classifier);
  console.log(classifier)
  classifiers.update({user: user}, {user: user, data: classifier}, function(err) {
    !err && console.log('fuck yeah')
  });


  // var __classifier = new classifiers({
    // user: user,
    // data: data
  // });
  
  // __classifier.save(function (err) {
    // var str = (err)?err:'classifier saved';
    // console.log(str);
  // });

};