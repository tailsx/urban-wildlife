var express = require('express');
var router = express.Router();
var gapi = require('../lib/gapi');
var request = require('request');
var index = require('../routes/index');
var Client = require('node-rest-client').Client;

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

router.get('/records/:username', function(req,res){
	client = new Client();

	var base = 'https://inaturalist.org';
	var endpoint = '/observations';
	var url = base + endpoint + '/' + req.params.username + '.json';

	// direct way
	client.get(url, function(data, response){
	            // parsed response body as js object
	            //console.log(data);
	            var parsed = JSON.parse(data);
	      		//console.log(parsed);
	      		//console.log(parsed[1].photos[0].medium_url);

	            // raw response
	            //console.log(response);
	res.render('records.jade',{ profile: '/users/profile',
	  						 info: 'Username: ',
	  						 logout: '/logout',
	  						 results: parsed});
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

router.get('/gettest', function(req,res){
	var profile = 'https://inaturalist.org/observations/tailsx.json';
	var r = request.get({
	    url: profile,
	    headers: { 'Authorization': 'Bearer ' + global.token }
	  }, function(err, response, body){
	      var parsed = JSON.parse(body);
	      console.log(parsed);
	      res.render('main.jade',{ profile: '/users/profile',
	  							   info: 'Username: ',
	  							   logout: '/logout'});
	  });
});

router.get('/playground', function(req,res){
	var client = new Client();

	// set content-type header and data as json in args parameter
	args_js ={
        parameters:{arg1:"hello",arg2:"world"},
        data:{"arg1":"hello","arg2":123},
        headers:{"Content-Type": "application/json"} 
      };

	// registering remote methods
	client.registerMethod("xmlMethod", "localhost:3000/users/hello", "POST");

	client.methods.xmlMethod(args_js,function(data,response){
    // parsed response body as js object
    //console.log(data);
    // raw response
    //console.log(response);


	res.render('test.jade',{ profile: '/users/profile',
	  						 info: 'Username: ',
	  						 logout: '/logout',
	  						 image: 'http://static.inaturalist.org/photos/1322146/large.JPG?1415082140'});
	});
});

router.post('/hello', function(req,res){
		res.render('test.jade',{ profile: '/users/profile',
	  						 info: 'Username: ',
	  						 logout: '/logout'});
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