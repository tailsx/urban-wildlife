var express = require('express');
var router = express.Router();
var oauth2 = require('oauth').OAuth2;
var gapi = require('../lib/gapi');
var http = require('http');
var fs = require('fs');
var request = require('request');
var Client = require('node-rest-client').Client;
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
                    console.log('Obtained access_token: ', access_token);
                    GLOBAL.token=access_token;
                    //res.cookie('user', parsed.login, { maxAge: 900000, httpOnly: true });
                    res.redirect('/users/main');
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
  client = new Client();
    var args = {
        parameters:{'user[email]': req.body.email,
                    'user[login]': req.body.username,
                    'user[password]': req.body.password,
                    'user[password_confirmation]': req.body.confirmpw},
        headers:{"Content-Type": "application/json"}
    }

    client.post('https://inaturalist.org/users.json',args, function(data,response){
        var parsed = JSON.parse(data);
        console.log(data[0]);
        console.log(parsed);
        console.log(parsed.errors);
        if (parsed.errors==undefined){
          res.redirect(gapi.url);
        }
        else{
          console.log("errors oops");
          console.log(parsed);
          var locals = {
                messages: parsed.errors,
                url: gapi.url,
                signup: '/signup'
              };
          res.render('signup.jade', locals);
        }
    });

});

router.post('/testsignup', function(req, res){
  console.log(req.body);
  console.log(res);

/*  client = new Client();

  var args ={

        par:{email: req.body.email,
                    login: req.body.username,
                    password: req.body.password,
                    password_confirmation: req.body.confirmpw},
        headers:{"test-header":"client-api"} // query parameter substitution vars
      };

    // registering remote methods
    client.registerMethod("xmlMethod", "https://inaturalist.org/users", "POST");


    client.methods.xmlMethod(user,function(data,response){
        // parsed response body as js object
        console.log(data);
        // raw response
        //console.log(response);
        res.send(data);
    });*/

  client = new Client();
/*    //var user = {'user[email]': req.body.email,
                    'user[login]': req.body.username,
                    'user[password]': req.body.password,
                    'user[password_confirmation]': req.body.confirmpw};*/
    
    var args = {
        parameters:{'user[email]': req.body.email,
                    'user[login]': req.body.username,
                    'user[password]': req.body.password,
                    'user[password_confirmation]': req.body.confirmpw},
        headers:{"Content-Type": "application/json"}
    }

    client.post('https://inaturalist.org/users.json',args, function(data,response){
        // parsed response body as js object
        console.log(data);
        // raw response
        //console.log(response);
        res.send(data);
    });
});

router.get('/logout', function(req, res){
  var r = request.get({
    url: 'https://inaturalist.org/logout',
    headers: { 'Authorization': 'Bearer ' + token }
    }, function(err, res, body){
      console.log(res.status);
      console.log(err);
    });
  var locals = {
        title: 'This is my TEST app',
        url: gapi.url
      };
  token=undefined;
  res.redirect('/');
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
      res.render('projects.jade',{projects: data});
  });
});

router.get('/projects/:id', function(req, res){
  // Get projects from around Toronto
  rest.get('http://www.inaturalist.org/observations/project/' + req.params.id + '.json')
      .on('complete', function(data,response){
        res.render('projectrecords.jade',{results: data});
  });
});

/* example in calling app */
function requestCallback(err, res, body) {
    console.log(body);
}

router.get('/temp', function(req, res) {
  res.render('layout.jade');
});

module.exports = router;
