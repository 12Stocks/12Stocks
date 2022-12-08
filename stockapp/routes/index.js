var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var cookie = require('cookie');
const db = require('../config/DB');
var indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', function(req, res, next) {
  var datas = { recentItems: undefined }; 
  var cookies = cookie.parse(req.headers.cookie);
  var recentItemArr = [];

  if (cookies.recent_items == undefined) {
    if (auth.isOwner(req, res))
      datas.userId = req.user.user_id;
    res.render('index', datas);
  }
  else {
    var recentItems = cookies.recent_items;
    recentItemArr = recentItems.split(',');

    console.log(recentItemArr);

    indexController.GetRecentItems(recentItemArr, function(rItems) {
      datas.recentItems = rItems;
      indexController.GetTrendingPosts(function (trendingPosts) {
        datas.TrendingPosts = trendingPosts;
        if (auth.isOwner(req, res))
          datas.userId = req.user.user_id;
        res.render('index', datas);
      })
    })
  }
});

module.exports = router;
