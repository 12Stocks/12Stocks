var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var cookie = require('cookie');
const db = require('../config/DB');

/* GET home page. */
router.get('/', function(req, res, next) {

  // TODO : refactoring ex. cookieController
  var cookies = cookie.parse(req.headers.cookie);
  var recentItemArr = [];

  if (cookies.recent_items == undefined) {
    if (auth.isOwner(req, res)) {
      res.render('index', { userId: req.user.user_id, recentItems: undefined });
    } else {
      res.render('index', { recentItems: undefined });
    }
  }
  else {
    var recentItems = cookies.recent_items;
    recentItemArr = recentItems.split(',');

    var rItems = [];
    for (var i = 0; i < recentItemArr.length; i++) {
      var sql = "SELECT stock_code, stock_name from stocks WHERE stock_code = ?";
      db.query(sql, recentItemArr[i], function (err, recentItem) {
        if (err) throw err;

        rItems.push({ stock_code: recentItem[0].stock_code, stock_name: recentItem[0].stock_name});
        console.log(rItems);
        
        if (rItems.length == recentItemArr.length) {
          if (auth.isOwner(req, res)) {
            res.render('index', { userId: req.user.user_id, recentItems: rItems });
          } else {
            res.render('index', { recentItems: rItems });
          }
        }
      })
    }
  }
});

/////////////////
// Jquery Ajax test
// ajax : 페이지의 일부만 갱신하고 싶을 때
// Client와 Server 간에 비동기 통신으로 데이터를 주고받는 방법
router.get('/ajax', function (req, res) {
  res.render('ajaxTest');
});

router.get('/ajax/get', function (req, res) {
  var data = req.query.data;
  console.log('GET Parameter = ' + data);
  var result = data + ' Succese';
  console.log(result);
  res.send({ result: result });
});


router.post('/ajax/post', function (req, res) {
  var data = req.body.data;
  console.log('POST Parameter = ' + data);
  var result = data + ' Succese';
  console.log(result);
  res.send({ result: result });
});
/////////////////

module.exports = router;
