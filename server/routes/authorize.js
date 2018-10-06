var express = require('express');
var router = express.Router();
const Spotify = require('spotify-web-api-node');

var CLIENT_ID = '7acd31d9cb304dd6a8c2e0a5fc20970a'; // Your client id
var CLIENT_SECRET = '58b5368250d44ed19a313c6434e9da25'; // Your secret
var REDIRECT_URI = 'http://localhost:4001/logincallback';
const STATE_KEY = "spotify_auth_state";
const scopes = ['user-read-private', 'user-read-email'];

const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});

/**
 * The /login endpoint
 * Redirect the client to the spotify authorize url, but first set that user's
 * state in the cookie.
 */
const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);

router.get('/', (_, res) => {
    spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        console.log('The access token is ' + data.body['access_token']);
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
        res.mydata = {}
        var token = data.body['access_token'];
        res.json( {token : token} );
        res.send();
      }, function(err) {
        console.log('Something went wrong when retrieving an access token', err.message);
      });


  //const state = generateRandomString(16);
  //res.cookie(STATE_KEY, state);
  //try {
  //var authorized_url = spotifyApi.createAuthorizeURL(scopes, state);
  //} catch (err) {
    //console.log(err);
  //}
  //console.log(spotifyApi);
  //console.log(spotifyApi.createAuthorizeURL);
  //res.redirect(authorized_url);
  //res.redirect('/logincallback');
});

module.exports = router;
