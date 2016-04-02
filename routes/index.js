var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('KKB', { title: 'main', users:{} });
});

router.get('/about', function(req, res, next) {
  res.render('KKB', { title: 'about' });
});

module.exports = router;
