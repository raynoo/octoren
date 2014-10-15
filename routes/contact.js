var express = require('express'),
  nodemailer = require('nodemailer'),
  config = require('../config'),
  router = express.Router();

var defaultTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.pass
  }
});

var sendMail = function(emailParams) {
  defaultTransport.sendMail({
    from: config.mailer.defaultFromAddress,
    to: config.mailer.auth.user,
    subject: emailParams.subject,
    html: emailParams.html,
    generateTextFromHTML: true
  }, function (err, responseStatus) {
    if (err) {
      return err;
    }
  });
  defaultTransport.close();
};

/* GET contact page. */
router.get('/', function(req, res) {
  res.render('contact', { title: 'Leave a Message' });
});

router.post('/', function(req, res) {
  console.log(req.body);
  
  req.assert('name', 'Name is required.').notEmpty();
  req.assert('email', 'Valid email is required.').isEmail();
  var errors = req.validationErrors(true);
  
  if(!errors) {
    sendMail({
      subject: "Contact Form Message - " + req.body.name,
      html: "<p>" + req.body.message + "</p>"
    });
  } else {
    console.log(errors);
  //   res.render('error', {
  //     title: "Oops, an error!",
  //     message: "Contact form: Please enter correct values in the form.",
  //   });
  }
  res.end();
});

module.exports = router;