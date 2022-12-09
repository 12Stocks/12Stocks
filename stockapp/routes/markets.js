var express = require('express')
var router = express.Router();
var auth = require('../lib/auth');
var watchListController = require('../controllers/watchListController'); 
var cookie = require('cookie');
var crawling = require('../crawling/crawling');
const db = require('../config/DB');
const constants = require('../lib/constants');

const sorting = async (array) => {
    return await array.sort((a, b) => b.total_val - a.total_val);
}

router.get('/:item_code', function (req, res) {
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
                    res.render('stockItem', { userId: req.user.user_id, item: req.itemInfo, disabled: "disabled" });
                } else { // watchlist에 없음
                    res.render('stockItem', { userId: req.user.user_id, item: req.itemInfo, disabled: "" });
                }
            })
        }
        else {
            res.render('stockItem', { item: req.itemInfo, disabled: "" });
        }
    })
});

router.get('/:item_code/add_to_watchlist', function (req, res) {
    if (req.user) {
        watchListController.AddToWatchList(req.user.user_id, req.params.item_code, 1, function () {
            res.send({ result: true })
        });
    } else {
        console.log("You are not logged in, please login first");
        // TODO change this to modal
        res.send({ result: false })
    }
});


router.get('/showBasicCandle/:item_code', function (req, res) {
    let sql = "SELECT (UNIX_TIMESTAMP(s.DT)*1000) as T_MS, s.O_PRC, s.H_PRC, s.L_PRC, s.C_PRC, s.VOL " +
                    "FROM stockapp.stock_prices as s WHERE s.STK_CD = ?"; 
    
    db.query(sql, [req.params.item_code], function (err, rows) {
        if (err) throw err;
        if (rows.length == 0) {
            // 에러 페이지 리다이렉트 필요
            console.log("Invalid stock code.");
        }
        res.render('showBasicCandle', {cData: rows});
    });
});

router.get('/', function (req, res) {
    crawling.KOSPI200(req, res, async function () {
        var rows = await sorting(req.kospi200);
        if (auth.isOwner(req, res)) {
            res.render('markets', { userId: req.user.user_id, stocks: rows });
        }
        else {
            res.render('markets', { stocks: rows });
        }
    });
});

module.exports = router;