var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var cookie = require('cookie');
const db = require('../config/DB');
var indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', function(req, res, next) {
  var datas = {}; 
  var recentItemArr = [];
  let cookies = {};

  // 쿠키가 아직 등록이 되어 있지 않은 상태에서 발생하는
  // "argument str must be a string" 에러 해결
  if (req.headers.cookie){ 
    cookies = cookie.parse(req.headers.cookie);
  }

  if (cookies.recent_items != undefined) {
    var recentItems = cookies.recent_items;
    recentItemArr = recentItems.split(',');
  }
  
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
});


module.exports = router;
