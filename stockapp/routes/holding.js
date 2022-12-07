var express = require('express')
var router = express.Router();
var auth = require('../lib/auth');
var watchListController = require('../controllers/watchListController'); 
var cookie = require('cookie');
var crawling = require('../crawling/crawling');

router.get('/', function(req, res) {
    if (auth.isOwner(req, res)) {
        res.render('holding', { userId: req.user.user_id, prc : 56000 + 100 * Math.round((Math.random() - 0.5) * 10)});
    }
    else {
        res.render('holding');
    }
});

module.exports = router;