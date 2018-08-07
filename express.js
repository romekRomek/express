var jsforce = require('jsforce');
var fs = require('fs');
var express = require('express');
var path = require('path');
var PORT = process.env.PORT || 5000;

var salesforceConnection = new jsforce.Connection({
	loginUrl: 'https://test.salesforce.com'
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => {
    var username = req.query.username;
    var password = req.query.password;

    console.log("username: " + username);
    console.log("password: " + password);

    salesforceConnection.login(username, password, function(err, userInfo) {
      if (err) { 
        res.send(err)
      }

      console.log(salesforceConnection.accessToken);
      console.log(salesforceConnection.instanceUrl);
      console.log("User ID: " + userInfo.id);
      console.log("Org ID: " + userInfo.organizationId);

      // w tym miejscu leci blad, szukam co
      salesforceConnection.metadata.retrieve(
        { packageNames: [ 'ApexClass' ] }
      ).stream().pipe(fs.createWriteStream("./package.zip"));
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))