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

/*Set constant to db to equal deployed database or use default local mongoHeadlines database*/
const db = proess.env.MONGODB_URI || "mongodb://localhost/articleHeadlines";

/*Call mongoose to connect to the server and run log command status */
mongoose.connect(db, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Mongoose has successfully connected!");
    }
});

/*Set a constant variable for your port or app port*/
const PORT = process.env.PORT || 3306;

/*Call the app to label the public folder as static*/
app.use(express.static(__dirname + "/public"));

/*Set the app to connect handlebars with express*/
app.engine("handlebars", exphbs({
    defaultLayout: + "main"
  }));

app.get('/', function (req, res) {
    res.render('home');
});
 
/*Call the app to use router middleware for every request*/
app.use(router);

/*Set the app to use han*/
app.set("view engine", "handlebars");

/*Set the app to listen to PORT set above*/
app.listen(PORT, function() {
    console.log("The app is listening om port: " + PORT);
});