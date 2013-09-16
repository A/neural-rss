'use strict';
var express = require('express')
  , routes = require('./routes')
  , path = require('path')
  , stylus = require('connect-stylus');
  
  // OverwriteModelError: Cannot overwrite `article` model once compiled.
  // , Articles = require('../get-articles'); 


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});
// Обработка ошибок
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    console.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});
app.get('/css/style.css', stylus({
  entry: './stylus/style.styl',
  use: ['nib', 'normalize']
}));

// development only
// if ('development' == app.get('env')) {
app.use(express.errorHandler());
// }

routes(app);

app.listen(app.get('port'), function(){
    console.log('Express server listening on port', app.get('port'));
});