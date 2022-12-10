var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var holdingController = require("../controllers/holdingController");
var cookie = require('cookie');
var crawling = require('../crawling/crawling');

router.get('/', async function(req, res) {
    if (auth.isOwner(req, res)) {
        holdingController.getHolding(req.user.user_id, async (rows) => {
            res.render('holding', {userId : req.user.user_id, holdings : rows});
        });
    }
    else {
        res.redirect('/auth/loginRequired');
    }
});

module.exports = router;