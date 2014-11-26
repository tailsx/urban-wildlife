var express = require('express');
var router = express.Router();
var gapi = require('../lib/gapi');
var request = require('request');
var index = require('../routes/index');
var Client = require('node-rest-client').Client;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs')

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
		var parseduser = JSON.parse(data);
		clientmap = new Client();

		var base = 'https://inaturalist.org';
		var endpoint = '/observations/project/urban-wildlife';
		var url = base + endpoint + '.json';

	    client.get(url, args, function(datamap, response){
		    var parsedmap = JSON.parse(datamap);

		    console.log(parseduser);
			console.log(parsedmap);

			res.render('main.jade',{ userdata: parseduser,
									 mapdata: parsedmap,
									 toProfile: '/users/profile',
									 toMain: '/users/main',
			  						 logout: '/logout',
			  						 toRecords : '/users/records/'+ parseduser.login,
			  						 toNew : '/users/newrecord'});
		});
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
	res.render('profile.jade',{ toMain: '/users/main',
		  						toRecords : '/users/records/'+parsed.login,
		  						toNew : '/users/newrecord',
		  						profile: parsed});
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
		res.render('records.jade',{ toMain: '/users/main',
									toProfile: '/users/profile',
			  						info: req.params.username,
			  						results: parsed,
			  					    toNew : '/users/newrecord'});
	});
});

router.get('/newrecord', function(req,res){
	var profile = 'https://inaturalist.org/users/edit.json';
	var r = request.get({
	    url: profile,
	    headers: { 'Authorization': 'Bearer ' + global.token }
	  }, function(err, response, body){
	      console.log(body);
	      var parsed = JSON.parse(body);
	      res.render('newrecord.jade',{ toMain: '/users/main',
	      								toProfile: '/users/profile',
										toNew : '/users/newrecord',
										toRecords : '/users/records/'+parsed.login});
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

router.get('/reference', function(req,res){
	var profile = 'https://inaturalist.org/users/edit.json';
	var r = request.get({
	    url: profile,
	    headers: { 'Authorization': 'Bearer ' + global.token }
	  }, function(err, response, body){
	      console.log(body);
	      var parsed = JSON.parse(body);
	      res.render('displayreference.jade',{ toMain: '/users/main',
	      									   toProfile: '/users/profile',
										       toNew : '/users/newrecord',
										       toRecords : '/users/records/'+parsed.login});
	  });
});

router.post('/reference', function(req,res){
	var profile = 'https://inaturalist.org/users/edit.json';
	var r = request.get({
	    url: profile,
	    headers: { 'Authorization': 'Bearer ' + global.token }
	  }, function(err, response, body){
	  		var parsed = JSON.parse(body);
	      	client = new Client();

		    var args = {
		        parameters:{'q': req.body.search}
		    }

		    client.get('http://data.canadensys.net/vascan/api/0.1/search.json',args, function(data,response){
	      		res.render('reference.jade',{ toMain: '/users/main',
	      									  toProfile: '/users/profile',
										      toNew : '/users/newrecord',
										      toRecords : '/users/records/'+parsed.login,
										   	  searchResults : data});
	  		});
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
	client = new Client();

	var args = {
        parameters:{'observation_photo[observation_id]': '1055033'}, //maybe read image file given by path.
        data : {'file' : req.files.file.ws},
        headers:{'Authorization': 'Bearer ' + global.token}
    }

    client.post('https://inaturalist.org/observation_photos',args, function(data,response){
        //console.log(response);
        //console.log(data);
        console.log("something");
       	console.log(response.body);
       	res.send("parsed");
    });
    //content = data;

    // Invoke the next step here however you like
    //res.send(content);   // Put all of the code here (not the best solution)

/*	console.log(req.files);
	console.log(req.files.file);
	//1055035
	var options = {
		url: 'https://inaturalist.org/observation_photos',
		formData: req.files.file
	};

	request.post(options, function optionalCallback(err, httpResponse, body) {
	  if (err) {
	    return console.error('upload failed:', err);
	  }
	  console.log(httpResponse);
	  console.log('Upload successful!  Server responded with:', body);
	  res.send(body);
	});*/

/*    var args = {
        parameters:{'observation_photo[observation_id]': '1055033',
    				'file' : req}, //maybe read image file given by path.
        headers:{'Authorization': 'Bearer ' + global.token}
    }

    client.post('https://inaturalist.org/observation_photos',args, function(data,response){
        //console.log(response);
        //console.log(data);
        console.log("something");
        res.send(data);
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