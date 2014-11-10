var express = require('express');
var router = express.Router();
var gapi = require('../lib/gapi');
var request = require('request');
var index = require('../routes/index');
var Client = require('node-rest-client').Client;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/main', function(req, res) {
	client = new Client();

	var base = 'https://inaturalist.org';
	var endpoint = '/users/edit';
	var url = base + endpoint + '.json';

	var args = {
        headers:{"Content-Type": "application/json",
    			"Authorization": 'Bearer ' + global.token}
    }

	// direct way
	client.get(url, args, function(data, response){
	    var parsed = JSON.parse(data);
		res.render('main.jade',{ pic: parsed.medium_user_icon_url,
								 link: parsed.uri,
								 profile: '/users/profile',
		  						 info: parsed.login,
		  						 logout: '/logout',
		  						 toRecords : '/users/records/'+ parsed.login});
	});
});

router.get('/profile', function(req,res){
	client = new Client();

	var base = 'https://inaturalist.org';
	var endpoint = '/users/edit';
	var url = base + endpoint + '.json';

	var args = {
        headers:{"Content-Type": "application/json",
    			"Authorization": 'Bearer ' + global.token}
    }

    // direct way
	client.get(url,args, function(data, response){
	            // parsed response body as js object
	            //console.log(data);
	            var parsed = JSON.parse(data);
	      		console.log(parsed);
	      		//console.log(parsed[1].photos[0].medium_url);

	            // raw response
	            //console.log(response);
	res.render('profile.jade',{ profile: '/users/profile',
		  						info: parsed.login,
		  						logout: '/logout',
		  						creation: parsed.created_at,
		  						count: parsed.observations_count,
		  						email: parsed.email,
		  						toRecords : '/users/records/'+parsed.login});
	});
});

router.get('/records/:username', function(req,res){
	client = new Client();

	var base = 'https://inaturalist.org';
	var endpoint = '/observations';
	var url = base + endpoint + '/' + req.params.username + '.json';

	// direct way
	client.get(url, function(data, response){
		var parsed = JSON.parse(data);
		res.render('records.jade',{ profile: '/users/profile',
			  						info: req.params.username,
			  						logout: '/logout',
			  						results: parsed});
	});
});

router.get('/newrecord', function(req,res){
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
	client = new Client();

    var args = {
        parameters:{'observation[species_guess]': req.body.guess,
    				'observation[observed_on_string]': req.body.seen,
    				'observation[description]': req.body.desc},
        headers:{"Content-Type": "application/json",
    			"Authorization": 'Bearer ' + global.token}
    }

    client.post('https://inaturalist.org/observations.json',args, function(data,response){
        res.redirect('/users/main');
    });
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
	client = new Client();
/*	console.log(req.body.cname);

    var args = {
        parameters:{'observation[species_guess]': req.body.cname},
        headers:{"Content-Type": "application/json",
    			"Authorization": 'Bearer ' + global.token}
    }

    client.post('https://inaturalist.org/observations.json',args, function(data,response){
        res.send(data);
    });*/
    res.render('test.jade',{ profile: '/users/profile',
	  							   info: 'Username: ' + 'fe',
	  							   logout: '/logout'});
});

router.post('/playground', multipartMiddleware, function(req,res){
	console.log(req.body);
	console.log(req.files);
	//1055035

	req.pipe(request.post('https://inaturalist.org/observation_photos?observation_photo[observation_id]=1055033', {form:req.body})).pipe(res);

	res.send('ok');
/*	client = new Client();
	console.log(req.body.cname);

    var args = {
        parameters:{'observation_photo[observation_id]': '1055033'},
        headers:{'Content-Type': 'multipart/form-data',
        		'Authorization': 'Bearer ' + global.token}
    }

    client.post('https://inaturalist.org/observation_photos',args, function(data,response){
        console.log(response);
        console.log(data);
        res.send(data);
    });*/
/*    var test = {
    	url: 'https://inaturalist.org/observation_photos?observation_photo[observation_id]=1055033',
    	formData:  req.files
    }
    request.post(test, function optionalCallback(err, httpResponse, body) {
	  if (err) {
	    return console.error('upload failed:', err);
	  }
	  console.log('Upload successful!  Server responded with:', body);
	});*/

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