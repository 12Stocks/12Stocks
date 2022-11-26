var express = require('express')
var router = express.Router();

router.get('/', function (req, res) {
    res.render('forums/index');
});
router.get('/show', function (req, res) {
    res.render('forums/show');
});
router.get('/new', function (req, res) {
    res.render('forums/new');
});
router.post('/new', function (req, res) {
    console.log(req.body);
    res.redirect("/forums");
});
router.get('/edit', function (req, res) {
    res.render('forums/edit');
});
router.post('/edit', function (req, res) {
    console.log(req.body);
    res.redirect("/forums");
});
router.post('/delete', function (req, res) {
    // res.render('forums/edit');
});

module.exports = router;