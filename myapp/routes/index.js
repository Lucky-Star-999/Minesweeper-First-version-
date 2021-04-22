var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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
  //console.log("Request received!");
  //console.log(req.body);

  //Write file
  let data = JSON.stringify(req.body);
  fs.writeFileSync('../myapp/public/json/temp_data_board.json', data);

  res.end();
  //res.render('../views/html/game');
});


router.get('/leaderboard', async function (req, res, next) {
  //console.log("Request received!");


  let a = "Xin chào";

  //Call query
  try {
    let results = await select_from_leaderboard(a);
    //console.log(results);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

  res.end();

});


router.post('/leaderboard_upload', async function (req, res, next) {
  //console.log("Request received!");

  //Call query
  try {
    let results = await insert_into_leaderboard(req.body);
    //console.log(results);

    //res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

  res.end();

});

router.get('/option', function (req, res, next) {
  res.render('../views/html/option');
});

module.exports = router;


function readFile() {
  let rawdata = fs.readFileSync('../myapp/public/json/temp_data_board.json');
  let data = JSON.parse(rawdata);

  let file = "";
  fs.writeFileSync('../myapp/public/json/temp_data_board.json', file);
  return data;
}


function select_from_leaderboard() {
  return new Promise((resolve, reject) => {

    //Connect to MySQL
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "minesweeper"
    });

    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!!!");
    });

    var sql = "SELECT * FROM Leaderboard";
    con.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};



function insert_into_leaderboard(json) {
  return new Promise((resolve, reject) => {

    //Connect to MySQL
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "minesweeper"
    });

    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!!!");
    });

    console.log(json.leader_board.player_name);
    let content = 'insert into Leaderboard (player_name, board_dimension, bomb_numbers, state_game, total_time, time_play)' +
    ' values ';
    content = content + '(' + '\'' + json.leader_board.player_name + '\'' + ', ' + '\'' + json.leader_board.board_dimension + '\'' + 
    ', ' + json.leader_board.bomb_numbers + ', ' +  '\'' +
    json.leader_board.state_game +  '\'' + ', ' + json.leader_board.total_time + ', ' + '\'' + json.leader_board.date + '\'' + ');';

    console.log(content);

    var sql = content;
    con.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};