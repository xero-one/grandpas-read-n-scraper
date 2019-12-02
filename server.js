/*Begin our constant defines and require calls==================================================*/

/*Set constant variable for npm express*/
const express = require("express");

/*Set constant variable for npm express-handlebars*/
const exphbs = require("express-handlebars")

/*Set constant variable for body-parser*/
var bodyParser = require("body-parser");

/*Set constant variable for npm mongoose db*/
const mongoose = require("mongoose");

const path = require("path");

/*Set constant to call the function npm express to initialize*/
const app = express();

/*Set constant variable to set npm express router protocal*/
const router = express.Router();

const publicPath = path.join(__dirname, "/public");

/*Set a constant variable for your port or app port*/
const PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;

/*Call mongoose to connect to the server and run log command status*/
const db = process.env.MONGODB_URI || "mongodb://grandpas-read-n-scraper:count123456@ds137498.mlab.com:37498/heroku_5dj9607r";
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, err => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Mongoose has successfully connected!");
        }
    });

/*Require our routes.js file to pass our router object containing our routes info*/
require("./config/routes")(router);

/*End of our constant defines and require calls=================================================*/






/*Begin our calls to program our app from the varibales/constants we defined above==============*/

/*Call the app to use bodyParser*/
app.use(bodyParser.urlencoded({
    extended: false
  }));

/*Call the app to label the public folder as static*/
app.use(express.static(publicPath));

/*Call the app to use router middleware for every request*/
app.use(router);

/*Handlebars*/
app.set("views", "./views");

/*Set the app to connect handlebars with express*/
app.engine("handlebars", exphbs({
    defaultLayout: "main"
  }));

/*Set the app to use han*/
app.set("view engine", "handlebars");


/*Set the app to listen to PORT set above*/
app.listen(PORT, () => {
    console.log("The app is listening om port: " + PORT);
});

/*End our calls to program our app from the varibales/constants we defined above==============*/