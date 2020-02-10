var express = require('express');
var passport = require('passport');
var request = require('request');

var BearerStrategy = require("passport-azure-ad").BearerStrategy;

var tenantID = 'tenantid';
var clientID = "clientid"; // guid
var audience = "appiduri"; 

var options = {
  identityMetadata: "https://login.microsoftonline.com/" + tenantID + "/v2.0/.well-known/openid-configuration",
  clientID: clientID,
  issuer: "https://sts.windows.net/" + tenantID + "/",
  audience: audience,
  loggingLevel: "info",
  passReqToCallback: false
};

var bearerStrategy = new BearerStrategy(options, function (token, done) {
  done(null, {}, token);
});

var app = express();
app.use(require('morgan')('combined'));
app.use(passport.initialize());
passport.use(bearerStrategy);

// Enable CORS for * because this is a demo project
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// This is where your API methods are exposed
app.all(
  "/api",
  passport.authenticate("oauth-bearer", { session: false }),
  function (req, res) {
    // the access token the user sent
    const userToken = req.get("authorization");
    // request new token and use it to call resource API on user's behalf
    getNewAccessToken(userToken, newTokenRes => {      
      callEndSecureAPI(newTokenRes.access_token, (apiResponse) => {
        res.status(200).json(JSON.parse(apiResponse));
      });
    });
  }
);

function getNewAccessToken(userToken, callback) {
  var middleAPIClientSecret = "secret";
  var endAPIResourceScope = "resourceuri";

  const [bearer, tokenValue] = userToken.split(" ");

  var options = {
    method: 'POST',
    url: 'https://login.microsoftonline.com/' + tenantID + '/oauth2/v2.0/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        client_id: clientID,
        client_secret: middleAPIClientSecret,
        scope: endAPIResourceScope,
        assertion: tokenValue,
        requested_token_use: 'on_behalf_of'
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback(body);
  });
}

function callEndSecureAPI(newTokenValue, callback) {
  var location = 'http://localhost:5002/api';
  request.get({
      headers: { 'content-type': 'application/json', 'Authorization' : 'Bearer ' + newTokenValue }
      , url: location, body: ''
  }, function (error, response, body) {
      callback(body);
  });
}

// Run this
var port = process.env.PORT || 5001;
app.listen(port, function () {
  console.log("Listening on port " + port);
});
