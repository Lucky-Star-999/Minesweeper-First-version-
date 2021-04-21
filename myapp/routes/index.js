var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/



router.get('/', function(req, res, next) {
  res.render('../views/html/index');
});

router.get('/option', function(req, res, next) {
  res.render('../views/html/option');
});

module.exports = router;
