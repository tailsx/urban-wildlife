var express = require('express');
var router = express.Router();
var gapi = require('../lib/gapi');
var request = require('request');
var index = require('../routes/index');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/main', function(req, res) {
  var locals = {
        profile: '/users/profile',
        info: 'hello',
        logout: '/logout'
      };
  console.log(req.params)
  res.render('main.jade', locals);
});

router.get('/profile', function(req,res){
	console.log("hello" + index.token);
	console.log("hello2" + global.token);
	var profile = 'https://inaturalist.org/users/edit.json';
	var r = request.get({
	    url: profile,
	    headers: { 'Authorization': 'Bearer ' + global.token }
	  }, function(err, response, body){
	      console.log(body);
	      var parsedBody = JSON.parse(body);
	      console.log(parsedBody.login);
	      res.render('main.jade',{ profile: '/users/profile',
	  							   info: 'Username: ' + parsedBody.login,
	  							   logout: '/logout'});
	  });
});

router.get('/newrecord', function(req,res){
	console.log("hello" + index.token);
	console.log("hello2" + global.token);
	var profile = 'https://inaturalist.org/users/edit.json';
	var r = request.get({
	    url: profile,
	    headers: { 'Authorization': 'Bearer ' + global.token }
	  }, function(err, response, body){
	      console.log(body);
	      var parsedBody = JSON.parse(body);
	      console.log(parsedBody.login);
	      res.render('newrecord.jade',{ profile: '/users/profile',
	  							   info: 'Username: ' + parsedBody.login,
	  							   logout: '/logout'});
	  });
});

router.post('/newrecord', function(req,res){
	console.log('yay');
	res.redirect('main');
});


module.exports = router;

/*
Notes:
- now want to record data
- assume in filesystem there are photos to upload
	- be able to select file and upload
- review previous items

-nearby observations(neat feature)
-find other similars for design inspirations

-user story, everyday users


*/