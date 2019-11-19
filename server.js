const express = require("express");

/*Set constant variable for npm mongoose*/
const mongoose = require("mongoose");

const routes = require("./routes");


const PORT = process.env.PORT || 3306;

/*Global constant to call the function npm express to initialize*/
const app = express();


/*Connect to the Mongo DB*/
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


app.use("/",routes);


mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then((data) => {
    /*Add listener function that calls the port*/
    app.listen(PORT, function () {
      console.log("Scraper running on port " + PORT + "!");
    });
})
.catch(err => {
  console.log('There is an error connecting to MongoDB');
});