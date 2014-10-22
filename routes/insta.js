var express = require('express'),
  router = express.Router(),
  superagent = require('superagent'),
  config = require('../config');

/* GET instagram feed. */
router.get('/', function(req, res) {
  
  superagent.get(config.instagram.url, function(err, ires) {
    console.log(ires.res.body.meta);
    return res.render('insta', { popular: ires.res.body.data, title: 'Renu\'s Instagram Feed' });
  });

});

module.exports = router;
