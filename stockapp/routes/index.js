var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var cookie = require('cookie');
const db = require('../config/DB');
var indexController = require('../controllers/indexController');

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

    console.log(recentItemArr);

    indexController.GetRecentItems(recentItemArr, function(rItems) {
      if (auth.isOwner(req, res)) {
        res.render('index', { userId: req.user.user_id, recentItems: rItems });
      } else {
        res.render('index', { recentItems: rItems });
      }
    })

  }
});

module.exports = router;
