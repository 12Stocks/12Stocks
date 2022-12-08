var express = require('express')
var router = express.Router();
var auth = require('../lib/auth');
var watchListController = require('../controllers/watchListController'); 
var cookie = require('cookie');
var crawling = require('../crawling/crawling');
const constants = require('../lib/constants');

const sorting = async (array) => {
    return await array.sort((a, b) => b.total_val - a.total_val);
}

router.get('/', function (req, res) {
    crawling.KOSPI200(req, res, async function() {
        var rows = await sorting(req.kospi200);
        if (auth.isOwner(req, res)) {
            res.render('markets', { userId: req.user.user_id, stocks: rows });
        }
        else {
            res.render('markets', { stocks: rows });
        }
    })
});

router.get('/:item_code', function (req, res) {
    console.log(req);
    crawling.ItemPrice(req, res, function() {
        /// 최근 조회 목록을 cookie값으로 저장, TODO : Refactoring ex. cookieController.js
        if (req.headers.cookie !== undefined) {
            var cookies = cookie.parse(req.headers.cookie);
            if (cookies.recent_items == undefined) {
                res.cookie('recent_items', req.params.item_code, { maxAge: 900000 });
            }
            else {

                var recentItems = cookies.recent_items;
                var recentItemArr = recentItems.split(',');

                recentItemArr = recentItemArr.filter(item => item != req.params.item_code);

                if (recentItemArr.length == 0) {
                    recentItems = req.params.item_code;
                }
                else {
                    if (recentItemArr.length >= constants.MAX_RECENT_ITEMS) recentItemArr.pop();
                    recentItems = req.params.item_code + ',' + recentItemArr.join(',');
                }

                res.cookie('recent_items', recentItems, { maxAge: 900000 });
            }
        }
        ///

        if (auth.isOwner(req, res)) {
            watchListController.FindInWatchList(req.user.user_id, req.params.item_code, 1, (exist) => {
                if (exist) { // watchlist에 이미 있음
                    res.render('stockItem', { userId: req.user.user_id, item: req.itemInfo, text: "관심목록에 추가됨", disabled: "disabled" });
                } else { // watchlist에 없음
                    res.render('stockItem', { userId: req.user.user_id, item: req.itemInfo, text: "관심 목록에 추가", disabled: "" });
                }
            })
        }
        else {
            res.render('stockItem', { item: req.itemInfo, text: "관심 목록에 추가", disabled: "" });;
        }
    })
});

router.get('/:item_code/add_to_watchlist', function (req, res) {
    if (req.user) {
        watchListController.AddToWatchList(req.user.user_id, req.params.item_code, 1, function () {
            res.redirect(`/markets/${req.params.item_code}`);
        });
    } else {
        res.redirect("/auth/loginRequired");
    }
});

module.exports = router;