var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
const Spotify = require('spotify-web-api-node');

var CLIENT_ID = '7acd31d9cb304dd6a8c2e0a5fc20970a'; // Your client id
var CLIENT_SECRET = '58b5368250d44ed19a313c6434e9da25'; // Your secret
const STATE_KEY = "spotify_auth_state";
const scopes = ['user-read-private', 'user-read-email'];

const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
});

/**
 * The /callback endpoint - hit after the user logs in to spotifyApi
 * Verify that the state we put in the cookie matches the state in the query
 * parameter. Then, if all is good, redirect the user to the user page. If all
 * is not good, redirect the user to an error page
 */
router.get('/', (req, res) => {
  const { code, state } = req.query;
  console.log(code);
  console.log(state);
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  // first do state validation
  if (state === null || state !== storedState) {
    res.redirect('/#/error/state mismatch');
    console.log("Incorrect state");
  // if the state is valid, get the authorization code and pass it on to the client
  } else {
    res.clearCookie(STATE_KEY);
    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(data => {
      console.log("KAff");
      const { expires_in, access_token, refresh_token } = data.body;
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      // use the access token to access the Spotify Web API
      spotifyApi.getMe().then(({ body }) => {
        console.log(body);
      });

      // we can also pass the token to the browser to make requests from there
      res.redirect(`/#/user/${access_token}/${refresh_token}`);
    }).catch(err => {
      console.log(err);
      res.redirect('/#/error/invalid token');
    });
  }
});

module.exports = router;
