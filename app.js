'use strict';

var nconf = require('nconf');
var data = require('./data');
nconf.file({ file: 'config.json' });

console.log(nconf.get('user'));


var natural = require('natural'),
  porterStemmer = natural.PorterStemmerRu,
  classifier = new natural.BayesClassifier(porterStemmer);


for (var i = 0; i < data.good.length; i++) {
  classifier.addDocument(data.good[i], 'good');
  console.log('learn good');
};

for (var i = 0; i < data.bad.length; i++) {
  classifier.addDocument(data.bad[i], 'bads');
  console.log('learn bad');
};

classifier.train();

console.log('= = = = = = = = = =');
console.log('START CLASSIFICATION');

console.log('Test on good');
for (var i = 0; i < data.test_good.length; i++) {
  console.log("> ",classifier.classify(data.test_good[i]));
};

console.log('Test on bad');
for (var i = 0; i < data.test_bad.length; i++) {
  console.log("> ",classifier.classify(data.test_bad[i]));
};

var raw = JSON.stringify(classifier);
console.log(raw)
