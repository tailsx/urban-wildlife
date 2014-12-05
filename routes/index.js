var express = require('express');
var router = express.Router();
var oauth2 = require('oauth').OAuth2;
var gapi = require('../lib/gapi');
var http = require('http');
var fs = require('fs');
var rest = require('restler');

var token; //For now, store token in a variable for later use
//var basesite = 'http://localhost:3000';
var basesite = 'https://urban-wildlife.herokuapp.com';
/* GET home page. */
router.get('/', function(req, res) {
  var locals = {
        url: gapi.url,
        signup: '/signup'
      };
  res.render('index.jade', locals);
});

/* GET call back route*/
router.get('/oauth2callback', function(req, res) {
  var code = req.query.code;
  console.log(code);
  gapi.client.getOAuthAccessToken (
    code,
    {'grant_type' : 'authorization_code',
     'redirect_uri' : basesite + '/oauth2callback'},
    function (e, access_token, refresh_token, results){
                if (e) {
                    console.log(e);
                    res.end(e);
                } else if (results.error) {
                    console.log(results);
                    res.end(JSON.stringify(results));
                }
                else {
                    //Successfully got access token
                    rest.get('http://www.inaturalist.org//users/edit.json',{
                      headers:{"Content-Type": "application/json"},
                      accessToken: access_token
                    }).on('complete', function(user,response){
                      res.cookie('token', access_token);
                      res.cookie('user', user.login);
                      res.redirect('/users/main');
                    });
                }
              
    });
});


router.get('/signup', function(req, res){
    var locals = {
        messages: [],
        url: gapi.url,
        signup: '/signup'
      };
  res.render('signup.jade', locals);
});


router.post('/signup', function(req, res){
  rest.post('https://inaturalist.org/users.json',{
    data:{'user[email]': req.body.email,
          'user[login]': req.body.username,
          'user[password]': req.body.password,
          'user[password_confirmation]': req.body.confirmpw},
    headers:{"Content-Type": "application/json"}
  }).on('complete', function(data,response){
    if (data.errors==undefined){
      res.redirect(gapi.url);
    }
    else{
      var locals = {
            messages: data.errors,
            url: gapi.url,
            signup: '/signup'
          };
      res.render('signup.jade', locals);
    }
  });

});

router.get('/logout', function(req, res){
  rest.get('http://www.inaturalist.org/logout')
      .on('complete', function(data,response){
        res.clearCookie('user');
        res.clearCookie('token');
        res.redirect('/');
      });
});

router.get('/projects', function(req, res){
  // Get projects from around Toronto
  rest.get('http://www.inaturalist.org/projects.json',{
    query:{
      'page': 1,
      'latitude': 43.6532260000,
      'longitude': -79.3831840000
    }
  }).on('complete', function(data,response){

    rest.get('http://www.inaturalist.org//users/edit.json',{
      headers:{"Content-Type": "application/json"},
      accessToken: req.cookies.token
    }).on('complete', function(user,response){
      res.render('projects.jade',{projects: data,
                                  toProfile: '/users/profile',
                                  toMain: '/users/main',
                                  logout: '/logout',
                                  toRecords : '/users/records/'+ user.login,
                                  toNew : '/users/newrecord'});
    });
  });
});

router.get('/projects/:id', function(req, res){
  // Get projects from around Toronto
  rest.get('http://www.inaturalist.org/observations/project/' + req.params.id + '.json')
      .on('complete', function(data,response){
        rest.get('http://www.inaturalist.org//users/edit.json',{
          headers:{"Content-Type": "application/json"},
          accessToken: req.cookies.token
        }).on('complete', function(user,response){
          res.render('projectrecords.jade',{results: data,
                                            toProfile: '/users/profile',
                                            toMain: '/users/main',
                                            logout: '/logout',
                                            toRecords : '/users/records/'+ user.login,
                                            toNew : '/users/newrecord'});
        });
      });
});

router.get('/observations/:id', function(req, res){
  // Get projects from around Toronto
  rest.get('http://www.inaturalist.org/observations/' + req.params.id + '.json')
      .on('complete', function(data,response){
        rest.get('http://www.inaturalist.org//users/edit.json',{
          headers:{"Content-Type": "application/json"},
          accessToken: req.cookies.token
        }).on('complete', function(user,response){
          res.render('single.jade',{observation: data,
                                    toProfile: '/users/profile',
                                    toMain: '/users/main',
                                    logout: '/logout',
                                    toRecords : '/users/records/'+ user.login,
                                    toNew : '/users/newrecord'});
        });
  });
});

router.get('/addproject/:id', function(req, res){
  // Get projects from around Toronto
  rest.post('http://www.inaturalist.org/project_observations.json',{
    data:{'project_observation[observation_id]': req.params.id,
          'project_observation[project_id]': 3142},
    accessToken: req.cookies.token
  }).on('complete', function(data,response){
      console.log(data);
      res.redirect('/projects/3142');
  });
});

module.exports = router;
