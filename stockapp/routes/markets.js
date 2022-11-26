var express = require('express')
var router = express.Router();
var auth = require('../lib/auth');
var watchListController = require('../controllers/watchListController'); 
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
var cookie = require('cookie');
var crawling = require('../crawling/crawling');

const MAX_RECENT_ITEMS = 5;

router.get('/', function (req, res) {
    crawling.KOSPI200(req, res, function() {
        if (auth.isOwner(req, res)) {
            res.render('markets', { userId: req.user.user_id, stocks: req.kospi200 });
        }
        else {
            res.render('markets', { stocks: req.kospi200 });
        }
    })
});

router.get('/:item_code', function (req, res) {
    axios({
        url: 'https://finance.naver.com/item/main.naver?code=' + req.params.item_code,
        method: 'GET',
        responseType: 'arraybuffer',
    })
    .then(response => {
        try {
            const content = iconv.decode(response.data, 'EUC-KR');
            const $ = cheerio.load(content);
            
            const $now = $("#chart_area > div.rate_info > div > p.no_today > em").children("span")[0];
            const $closed = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(1) > td.first > em").children("span")[0];
            const $open = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(2) > td.first > em").children("span")[0];
            const $high = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(1) > td:nth-child(2) > em").children("span")[0];
            const $low = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(2) > td:nth-child(2) > em:nth-child(2)").children("span")[0];
            const $vol = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(1) > td:nth-child(3) > em").children("span")[0];
            const $val = $("#chart_area > div.rate_info > table > tbody > tr:nth-child(2) > td:nth-child(3) > em").children("span")[0];

            let name = $("#middle > div.h_company > div.wrap_company > h2 > a").text();
            let now = $($now).text();
            let closed = $($closed).text();
            let open = $($open).text();
            let high = $($high).text();
            let low = $($low).text();
            let vol = $($vol).text();
            let val = $($val).text();

            var item_info = {
                code: req.params.item_code,
                name: name,
                now: now,
                closed: closed,
                open: open,
                high: high,
                low: low,
                vol: vol,
                val: val
            }

            /// 최근 조회 목록을 cookie값으로 저장, TODO : Refactoring ex. cookieController.js
            if (req.headers.cookie !== undefined) {
                var cookies = cookie.parse(req.headers.cookie);
                if(cookies.recent_items == undefined) {
                    res.cookie('recent_items', req.params.item_code, { maxAge: 900000 });
                }
                else {

                    var recentItems = cookies.recent_items;
                    var recentItemArr = recentItems.split(',');

                    recentItemArr = recentItemArr.filter(item => item != req.params.item_code);
                    
                    if(recentItemArr.length == 0) {
                        recentItems = req.params.item_code;
                    }
                    else {
                        if (recentItemArr.length >= MAX_RECENT_ITEMS) recentItemArr.pop();
                        recentItems = req.params.item_code + ',' + recentItemArr.join(',');
                    }

                    res.cookie('recent_items', recentItems, { maxAge: 900000 });
                }
            }
            ///

            if (auth.isOwner(req, res)) {
                watchListController.FindInWatchList(req.user.id, req.params.item_code, 1, (exist) => {
                    if (exist) { // watchlist에 이미 있음
                        res.render('stockItem', { userId: req.user.user_id, item: item_info, text: "관심목록에 추가됨", disabled: "disabled" });
                    } else { // watchlist에 없음
                        res.render('stockItem', { userId: req.user.user_id, item: item_info, text: "관심 목록에 추가", disabled: "" });
                    } 
                })
            }
            else {
                res.render('stockItem', { item: item_info, text: "관심 목록에 추가", disabled: "" });;
            }
        } catch (err) {
            console.error(err);
        }
    })
});

router.get('/:item_code/add_to_watchlist', function (req, res) {
    if (req.user) {
        watchListController.AddToWatchList(req.user.id, req.params.item_code, 1, function () {
            res.redirect(`/markets/${req.params.item_code}`);
        });
    } else {
        res.redirect("/auth/loginRequired");
    }
});

module.exports = router;