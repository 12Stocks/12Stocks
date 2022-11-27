var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var crawling = require('../crawling/crawling');
var orderController = require("../controllers/orderController");

router.get('/:item_code', function (req, res) {
    crawling.ItemPrice(req, res, function () {
        
        var tickSize = orderController.GetTickSize(req.itemInfo.now);
        var datas = { 
                itemInfo: req.itemInfo, 
                tickSize: tickSize,
            };

        // TODO : refactor all the other codes like this
        if (auth.isOwner(req, res)) {
            datas.userId = req.user.user_id;
            res.render('order', datas);
        } 
        else {
            res.redirect('/auth/loginRequired');
        }
    });
});

// buy : 0
router.post('/:item_code/buy_process', function (req, res) {
    var post = req.body;
    var buy_quantity = post.bq;
    var buy_price = post.bp;
    orderController.Order(req.user.user_id, req.params.item_code, buy_quantity, 0, buy_price, function() {
        res.redirect('/order/' + req.params.item_code);
    });
});

// sell : 1
router.post('/:item_code/sell_process', function (req, res) {
    var post = req.body;
    var sell_quantity = post.sq;
    var sell_price = post.sp;
    orderController.Order(req.user.user_id, req.params.item_code, sell_quantity, 1, sell_price, function () {
        res.redirect('/order/' + req.params.item_code);
    });
});

module.exports = router;