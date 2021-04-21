var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

const fs = require('fs');

router.get('/', function (req, res, next) {
  res.render('../views/html/index');
});

router.get('/game', function (req, res, next) {
  let data = readFile();
  //res.send(data);
  res.render('../views/html/game', {
    number_of_squares_a_row: data.info_json.number_of_squares_a_row,
    number_of_squares_a_column: data.info_json.number_of_squares_a_column,
    number_of_bombs: data.info_json.number_of_bombs,
    name: data.info_json.name
  });
});

router.post('/game_request', function (req, res, next) {
  console.log("Request received!");
  //console.log(req.body);

  //Write file
  let data = JSON.stringify(req.body);
  fs.writeFileSync('../myapp/public/json/temp_data_board.json', data);



  res.end();
  //res.render('../views/html/game');
});

router.get('/option', function (req, res, next) {
  res.render('../views/html/option');
});

module.exports = router;


function readFile() {
  let rawdata = fs.readFileSync('../myapp/public/json/temp_data_board.json');
  let data = JSON.parse(rawdata);
  return data;
}

