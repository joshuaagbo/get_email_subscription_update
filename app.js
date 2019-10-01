const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const port = process.env.PORT || 5000;
const request = require("request");
const { chimp_api_key, chimp_auth_key } = require("./config/api-keys");
// init app
const app = express();
app.use(express.urlencoded({ extended: true }));
// set view engine
app.use(expressLayouts);
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
  res.render("index");
});

app.post("/signup", (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  if (!firstName || !lastName || !email) {
    return res.render("failure");
  }
  // construct requrest data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        marge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  // stringify postDatea
  const postData = JSON.stringify(data);
  const options = {
    url: `https://us20.api.mailchimp.com/3.0/lists/${chimp_api_key}`,
    method: "POST",
    headers: {
      Authorization: `auth ${chimp_auth_key}`
    },
    body: postData
  };
  // send request to the mailchimp api
  request(options, (err, response, body) => {
    if (err) {
      return res.render("failure");
    } else {
      if (response.statusCode === 200) {
        return res.render("success", {
          email,
          status: response.statusCode
        });
      } else {
        return res.render("failure");
      }
    }
  });
});

app.listen(port, () => console.log("Server Started At Port:", port));
