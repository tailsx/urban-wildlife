var express = require('express');
var router = express.Router();
var oauth2 = require('oauth').OAuth2;
var gapi = require('../lib/gapi');
var http = require('http');
var fs = require('fs');
var request = require('request');

var token; //For now, store token in a variable for later use

/* GET home page. */
router.get('/', function(req, res) {
  var locals = {
        title: 'This is my sample app',
        url: gapi.url,
        test: 'http://localhost:3000/test'
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
     'redirect_uri' : 'http://localhost:3000/oauth2callback'},
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
                    token=access_token;
                    res.end( access_token);
                }
              
    });
  console.log(token);
  var locals = {
        title: 'This is my sample app',
        url: gapi.url,
        test: 'http://localhost:3000/test'
      };
  res.render('index.jade', locals);
});

/* */
router.get('/code', function(req, res) {
  var locals = {
        title: 'This is my CODE app',
        url: gapi.url,
        test: 'http://localhost:3000/test'
      };
  res.render('index.jade', locals);
});


/* example in calling app */
function requestCallback(err, res, body) {
    console.log(body);
}

router.get('/test', function(req, res) {
  var r = request.post({
    url: 'https://inaturalist.org/users/edit.json',
    headers: { 'Authorization': 'Bearer ' + token }
    }, requestCallback);
  var locals = {
        title: 'This is my TEST app',
        url: gapi.url,
        test: 'http://localhost:3000/test'
      };
  res.render('index.jade', locals);
});

module.exports = router;
