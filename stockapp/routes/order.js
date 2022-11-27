var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var crawling = require('../crawling/crawling');

router.get('/:item_code', function (req, res) {
    crawling.ItemPrice(req, res, function () {
        if (auth.isOwner(req, res)) {
            res.render('order', { userId: req.user.user_id, itemInfo: req.itemInfo });
        } else {
            res.render('order', { itemInfo: req.itemInfo });
        }
    });
});

module.exports = router;
