'use strict';

var data = require('./data');

var natural = require('natural'),
  porterStemmer = natural.PorterStemmerRu,
  classifier = new natural.BayesClassifier(porterStemmer);


for (var i = 0; i < data.good.length; i++) {
  classifier.addDocument(data.good[i], 'good');
  console.log('learn good')
};

for (var i = 0; i < data.bad.length; i++) {
  classifier.addDocument(data.bad[i], 'bads');
  console.log('learn bad')
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




return





// for (var i = 0; i < data.bad.length; i++) {
//   net.train(data.bad[i], 'bad');
// };

// for (var i = 0; i < data.good.length; i++) {
//   net.train(data.good[i], 'good');
// };

// for (var i = 0; i < data.test_good.length; i++) {
//   var cat = net.classify(data.test_good[i]);
//   console.log(cat);
// };

// for (var i = 0; i < data.test_bad.length; i++) {
//   var cat = net.classify(data.test_bad[i]);
//   console.log(cat);
// };