var express = require('express'),
  router = express.Router(),
  superagent = require('superagent');

/* GET instagram feed. */
router.get('/', function(req, res) {
  var url = "https://api.instagram.com/v1/users/650067566/media/recent/?access_token=650067566.2e365fc.0b28e33ed0394964ac6af8aa747ecb84";
  
  superagent.get(url, function(err, ires) {
    console.log(ires.res.body.meta);
    return res.render('insta', { popular: ires.res.body.data, title: 'Renu\'s Instagram Feed' });
  });

});

module.exports = router;
