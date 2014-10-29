var express = require('express');
var router = express.Router();
var gapi = require('../lib/gapi');
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/main', function(req, res) {
  var locals = {
        title: 'This is my CODE app',
        url: gapi.url,
        logout: '/logout'
      };
  res.render('main.jade', locals);
});

module.exports = router;
