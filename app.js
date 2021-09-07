//require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const app = express();
const md5 = require("md5");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://kushwah007-as:Test123@cluster0.bulpo.mongodb.net/SocialApp",
  { useNewUrlParser: true }
);

const SocialAppSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// the code reffer to 1st level encription
// const secret = process.env.SECRET;
// SocialAppSchema.plugin(encrypt, {
//   secret: secret,
//   encryptedFields: ["password"],
// });

const SocialModel = mongoose.model("Userdata", SocialAppSchema);

app.get("/", function (request, response) {
  response.render("home");
});
app.get("/login", function (request, response) {
  response.render("login");
});
app.get("/register", function (request, response) {
  response.render("register");
});
app.get("/secrets", function (request, response) {
  response.render("secrets");
});
app.get("/submit", function (request, response) {
  response.render("submit");
});

app.post("/register", async (request, response) => {
  const registerData = new SocialModel({
    email: request.body.username,
    //password: request.body.password,
    //save password using md5
    password: md5(request.body.password),
  });
  try {
    await registerData.save();
    response.render("secrets");
  } catch (error) {
    response.status(400).send(error);
  }
});

app.post("/login", async (request, response) => {
  const userEmail = request.body.username;
  //const userPassword = request.body.password;
  // make a copy of password using md5
  const userPassword = md5(request.body.password);

  SocialModel.findOne({ email: userEmail }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === userPassword) {
          response.render("secrets");
        } else response.send("you have entered invalid password");
      }
    }
  });
});

let port = process.env.port;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("you are live on " + port);
});
