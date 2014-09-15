var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { author: 'Renu', description: 'Testing 1-2-4' });
});

module.exports = router;
