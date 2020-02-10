# NodeJS Web App secured by Azure AD demonstrating on-behalf-of-flow.

## See other Azure AD + NodeJS code examples

1. Daemon/serverless applications [Client Credential Flow](https://github.com/maliksahil/ms-identity-nodejs-client-credential-flow)
2. Web Applications [OIDCStrategy](https://github.com/maliksahil/ms-identity-nodejs-webapp)
3. Web APIs [BearerStrategy] (https://github.com/maliksahil/ms-identity-nodejs-webapi)
4. Forwarding user identity [On Behalf Of Flow] (https://github.com/maliksahil/ms-identity-nodejs-on-behalf-of)
5. Key Vault and [Managed Identity] (https://github.com/maliksahil/ms-identity-nodejs-managed-identity)

## endAPIApp: App setup and configuration

1. Register a web app, no redirect uri
2. Under the Expose an API section, add an appid URI, for example `https://<tenantname>.onmicrosoft.com/server`
3. Add a scope called `myscope`
4. Update the following lines in `server.js`:

```
var tenantID = "<tenantid>" ; // guid;
var clientID = "<clientid>" ; // guid
var audience = "<appiduri>" ; // example "https://tenantname.onmicrosoft.com/server"
```
5. Run `npm start`, your API is now running on `http://localhost:5002` 
6. To verify, visit `http://localhost:5002/admin`, you should get a 401.


## serverAPIApp: App setup and configuration

1. Register a web app, no redirect uri
2. Under the Expose an API section, add an appid URI, for example `https://<tenantname>.onmicrosoft.com/server`
3. Add a scope called `myscope`
4. Under Add a permission section, ensure serverAPIApp can call endAPIApp, don't forget to grant consent.
5. Update the following lines in `server.js`:

```
var tenantID = "<tenantid>" ; // guid;
var clientID = "<clientid>" ; // guid
var audience = "<appiduri>" ; // example "https://tenantname.onmicrosoft.com/server"

...
...
var endAPIResourceScope = "resourceuri"; // the resource URI (appIDURI) of the end API

```
6. Run `npm start`, your API is now running on `http://localhost:5001` 
7. To verify, visit `http://localhost:5001/admin`, you should get a 401.

## ClientWebApp: App setup and configuration
1. Register a web app
2. Redirect URI of `http://localhost:3000/auth/openid/return`
3. Enable id_token
4. Under API permissions, grant access to `https://<tenantname>.onmicrosoft.com/server/myscope`, ensure you grant consent. You are granting consent to serverAPIApp.
5. Add a client secret, note down it's value.
6. Update values in config.js, specifically the following 

```
var tenantName = '<tenantname>';
var tenantID = '<tenantid>';
var clientID = '<clientid>';
var clientSecret = '<clientsecret>';
....
....
exports.resourceURL = '<appiduri>'; // appiduri of serverAPIApp
```
7. Run `npm start`, and visit `http://localhost:3000` in your favorite browser. Verify that you can call the serverAPIApp using the "Call API" menu item.