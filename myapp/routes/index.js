var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/



router.get('/', function(req, res, next) {
  res.render('../views/html/index');
});

router.get('/game', function(req, res, next) {
  res.render('../views/html/game');
});

router.post('/game_request', function(req, res, next) {
  console.log("Request received!");
  console.log(req.body);
  res.end();
  //res.render('../views/html/game');
});

router.get('/option', function(req, res, next) {
  res.render('../views/html/option');
});

module.exports = router;
