/*Begin our constant defines and require calls==================================================*/

/*Set constant variable for npm express*/
const express = require("express");

/*Set constant variable for npm express-handlebars*/
const exphbs = require("express-handlebars")

/*Set constant variable for npm mongoose db*/
const mongoose = require('mongoose');

/*Set constant to call the function npm express to initialize*/

const app = express();

/*Set constant variable to set npm express router protocal*/
const router = express.Router();

/*Set a constant variable for your port or app port*/
const PORT = process.env.PORT || 3000;

/*Set constant to db to equal deployed database or use default local mongoHeadlines database*/
const db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

/*Call mongoose to connect to the server and run log command status*/
mongoose.connect(db, function(err) {
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

/*Call the app to label the public folder as static*/
app.use(express.static(__dirname + "/public"));

/*Set the app to connect handlebars with express*/
app.engine("handlebars", exphbs({
    defaultLayout: + "main"
  }));
 
/*Call the app to use router middleware for every request*/
app.use(router);

/*Set the app to use han*/
app.set("view engine", "handlebars");

/*Set the app to listen to PORT set above*/
app.listen(PORT, function() {
    console.log("The app is listening om port: " + PORT);
});

/*End our calls to program our app from the varibales/constants we defined above==============*/