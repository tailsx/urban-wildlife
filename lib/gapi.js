var oauth2 = require('oauth').OAuth2;
    client = 'cfa19467d21e020610447abd591449482f5924647d60b8c62261ccece1d5297e',
    secret = 'd84e0cc760caf2f7001a46ac837143e3a15c709b7def4856b2f2f2f4cb5d9fde',
    redirect = 'http://localhost:3000/oauth2callback',
    oauth2Client = new oauth2(client, 
    	                      secret, 
    						  'http://www.inaturalist.org',
    						  null,
    						  '/oauth/token');

var authURL = oauth2Client.getAuthorizeUrl({
		client_id: client,
        redirect_uri: redirect,
        response_type: 'code'
 });

exports.client = oauth2Client;
exports.url = authURL;
