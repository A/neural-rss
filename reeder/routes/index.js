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


  app.get('/label/:label', function(req, res) {
    
    var label = req.params.label;

    articles
      .find({
          labels: {
            $elemMatch: {
              label: label, 
              value: { $gte: 0.6 } 
            } 
          } 
        })
      .sort({date:-1}) // Я не понял, как сортировать по лэйблу (т.е., полю value в массиве где есть наш label, хммм...)
      .execFind(function (err, items) {
        console.log(items);
        res.render('index', {label: label, items: items, moment: moment});
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
        console.log('classifier is undefined');
        __classifier = new natural.BayesClassifier(natural.PorterStemmerRu);
      } else {
        console.log('classifier restored');
        __classifier = natural.BayesClassifier.restore(JSON.parse(classifier.data));
      }

      callback(err, __classifier);

    });
};


var saveClassifier = function(user, newclassifier) {
  
  var data = JSON.stringify(newclassifier);
  // console.log(classifier)
  classifiers.find({user: user}, function(err, classifier) {

    // if exists
    if (classifier && classifier[0]) {
      classifiers.update({user: user}, {user: user, data: data}, function(err) {
        console.log('save');
        if (err) {
          console.log(err)
        } else {
          console.log('Classifier saved without errors!')
        } 
      });

    // else create
    } else {
      console.log('create');
      var createdclassifier = new classifiers({
        user: user,
        data: data
      });
      
      createdclassifier.save(function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Classifier created without errors!')
        } 

      });

    }

  });

};