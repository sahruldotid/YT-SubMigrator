var express = require('express');
var router = express.Router();

//  Get Login pages

router.get('/', function(req, res, next){
    res.render('login');
});

module.exports = router;