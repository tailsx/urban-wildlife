var oauth2 = require('oauth').OAuth2;
    client = '57097fcd16242d903f72a334a7163f065858774f3589c3979f12a245ebb6f7a3',
    secret = 'ad0f3deeac523e5562b9a43336a0e3aea6bb950639809ef9ec2554fb44682d69',
    redirect = 'https://urban-wildlife.herokuapp.com/oauth2callback',
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
