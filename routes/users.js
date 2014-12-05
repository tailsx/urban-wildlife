var express = require('express');
var router = express.Router();
var gapi = require('../lib/gapi');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs')
var rest = require('restler');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/main', function(req, res) {

  //Get user's data
  rest.get('http://www.inaturalist.org/users/edit.json',{
    headers:{"Content-Type": "application/json"},
    accessToken: req.cookies.token
  })
  .on('complete', function(user,response){
  	//Also get all observations in hardcoded urban wildlife project
  	rest.get('http://www.inaturalist.org/observations/project/urban-wildlife.json')
    	.on('complete', function(map,response){
      	  res.render('main.jade',{userdata: user,
    						      mapdata: map,
                                  toProfile: '/users/profile',
                                  toMain: '/users/main',
                                  logout: '/logout',
                                  toRecords : '/users/records/'+ req.cookies.user,
                                  toNew : '/users/newrecord'});
     	});
  });
});

router.get('/profile', function(req,res){
  rest.get('http://www.inaturalist.org/users/edit.json',{
    headers:{"Content-Type": "application/json"},
    accessToken: req.cookies.token
  })
  .on('complete', function(user,response){
  	res.render('profile.jade',{ toMain: '/users/main',
	                            toRecords : '/users/records/'+ req.cookies.user,
	                            toNew : '/users/newrecord',
	                            profile: user});
  });
});

router.get('/records/:username', function(req,res){
  rest.get('https://inaturalist.org/observations/' + req.params.username + '.json')
  	  .on('complete', function(data,response){
  	    res.render('records.jade',{ toMain: '/users/main',
									toProfile: '/users/profile',
			  						info: req.params.username,
			  						results: data,
			  					    toNew : '/users/newrecord'});
  });
});

router.get('/newrecord', function(req,res){
  res.render('newrecord.jade',{ toMain: '/users/main',
  								toProfile: '/users/profile',
								toNew : '/users/newrecord',
								toRecords : '/users/records/'+ req.cookies.user});
});

router.post('/newrecord', multipartMiddleware, function(req,res){
	if (req.files.file.size == 0){
		rest.post('https://inaturalist.org/observations.json',{
			accessToken: req.cookies.token,
			data: {
				'observation[species_guess]': req.body.guess,
				'observation[observed_on_string]': req.body.seen,
				'observation[description]': req.body.desc,
				'observation[place_guess]': req.body.place,
				'observation[tag_list]': req.body.tag
			}
		}).on('complete', function(data,response){
			console.log(data);
			res.redirect('records/' + req.cookies.user);
		});
	}
	else{
		rest.post('https://inaturalist.org/observations.json',{
			accessToken: req.cookies.token,
			multipart: true,
			data: {
				'observation[species_guess]': req.body.guess,
				'observation[observed_on_string]': req.body.seen,
				'observation[description]': req.body.desc,
				'observation[place_guess]': req.body.place,
				'observation[tag_list]': req.body.tag,
				'local_photos[0]': rest.file(req.files.file.path,
											 req.files.file.name,
											 req.files.file.size,
											 null,
											 req.files.file.type)
			}
		}).on('complete', function(data,response){
			console.log(data);
			res.redirect('records/' + req.cookies.user);
		});
	}
});

router.get('/reference', function(req,res){
  res.render('displayreference.jade',{ toMain: '/users/main',
  								       toProfile: '/users/profile',
								       toNew : '/users/newrecord',
								       toRecords : '/users/records/'+ req.cookies.user});
});

router.post('/reference', function(req,res){
  rest.get('http://data.canadensys.net/vascan/api/0.1/search.json',{
    query:{'q': req.body.search}
  })
  .on('complete', function(results,response){
  	res.render('reference.jade',{ toMain: '/users/main',
								  toProfile: '/users/profile',
							      toNew : '/users/newrecord',
							      toRecords : '/users/records/'+ req.cookies.user,
							   	  searchResults : results });
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
	rest.post('https://inaturalist.org/observation_photos/',{
		multipart: true,
		accessToken: global.token,
		data: {
			'observation_photo[observation_id]': 1091193,
			'file': rest.file(req.files.file.path,
							  req.files.file.name,
							  req.files.file.size,
							  null,
							  req.files.file.type)
		}
	}).on('complete', function(data,response){
		console.log(data);
		console.log(response);
		res.redirect('/users/main');
	});

});

router.get('/playground2', function(req,res){
	rest.post('https://inaturalist.org/observations.json',{
		accessToken: global.token,
		data: {
			'observation[species_guess]': 'Testiddng',
			'observation[id_please]': '0',
			'observation[observed_on_string]': '2014-12-04',
			'observation[description]': 'Trying something',
			'observation[place_guess]': 'toronto,ontario',
			'observation[latitude]': '43.77872259999999',
			'observation[longitide]': '-79.9527607',
			'observation[location_is_exact]': 'false',
			'observation[map_scale]': '10',
			'observation[positional_accuracy]': '31072',
			'observation[geoprivacy]': 'open'
		}
	}).on('complete', function(data,response){
		console.log(data);
		res.send(data);
	});
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

TUESDAY DECEMBER 9th, MEETING WITH STEVE AT 4PM
*/