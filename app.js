//jshint esversion:6
const express = require('express');
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
//the public is a static file and is needed to store our images and css
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + ('/signup.html'));
});

app.post("/failure",function(req,res){
res.redirect('/');
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log(firstName);
  console.log(lastName);
  console.log(email);

  const data = {
    members: [{
      email_address: email,
      // you get to choose which option you want, because we are adding people to our mailing list their status will now be subscribed
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  // The url we are sending data to naturally has a usX we have to replace that X with the last
  // number in our api key from https://usX.api.mailchimp.com/3.0/ to https://us4.api.mailchimp.com/3.0/

  const url = "https://us4.api.mailchimp.com/3.0/lists/ac3f539dcd";

  const options = {
    method: "post",
    auth: "API_KEY:edefe58885d20a2ad7dd0b68766090fe-us4"
  };

  // we send data to the mailchimp servers the documentation for
  // this request is here: https://nodejs.org/api/http.html#http_http_request_options_callback
  const request = https.request(url, options, function(response) {
    if (response.statusCode===200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

  });

  //the reason we made our request a variable then
  // passed our data we want to send to mailchimp with a request.write is because of
  // this documentation: https://stackoverflow.com/questions/40537749/how-do-i-make-a-https-post-in-node-js-without-any-third-party-module

  request.write(jsonData);
  request.end();

});

// Notice that I used to listen on port 3000 and am now listening on process.enve.PORT note that the word PORT must be in caps
//from app.listen(3000, function() { to:  app.listen(process.env.PORT || 3000, function() {
app.listen(process.env.PORT || 3000, function() {
  console.log("servers up");
});



// Mail chimp api key
// edefe58885d20a2ad7dd0b68766090fe-us4

//Mail chimp List ID
// ac3f539dcd
