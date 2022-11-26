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
    res.cookie('recent_items', req.params.item_code, { maxAge: 900000 });
  }
  else {
    var recentItems = cookies.recent_items;
    recentItemArr = recentItems.split(',');
  }

  // TODO : refactoring ex. getStockNameWithCode
  var recentItemNames = [];
  for(var i =0; i < recentItemArr.length; i++) {
    var sql = "SELECT stock_name from stocks WHERE stock_code = ?";
    db.query(sql, recentItemArr[i], function(err, recentItem) {
      if (err) throw err;

      recentItemNames.push(recentItem[0].stock_name);
      if (recentItemNames.length == recentItemArr.length) {
        if (auth.isOwner(req, res)) {
          res.render('index', { userId: req.user.user_id, recentItems: recentItemNames });
        } else {
          res.render('index', { recentItems: recentItemNames });
        }
      }
    })
  }
});

module.exports = router;
