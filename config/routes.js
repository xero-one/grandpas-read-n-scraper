/*Set a constant variable for axios to call in our Headlines*/
const axios = require('axios');

/*Set a constant variable for cheerio to asist in calling information from the New York times quickly*/
const cheerio = require("cheerio");

const db = require("../models");

module.exports = router => {
    /*Set the router to get or render the home webpage components of our website to route to the default path "/"*/
    router.get('/', function (req, res) {
        db.headlineJS.find({saved: false}, function(err, data){
          res.render('home', { home: true, article : data });
        })
    });
    

    /*Set the router to get or render the saved webpage components of our website to route to path "/" + "saved"*/
    router.get('/saved', function (req, res) {
        db.headlineJS.find({saved: true}, function(err, data){
          res.render('saved', { home: false, article : data });
        })
    });
    

    /*API routing for middleware to render all api data fetched from our code*/
    router.get("/api/fetch", function (req, res) {
        /*Here we set our router to GET the route for scraping the nytimes website, we then grab the body of the html with axios*/
        axios.get("https://www.nytimes.com/").then(function (response) {
            /*Then, we load that into cheerio and save it to $ for a shorthand selector*/
            const $ = cheerio.load(response.data);

            /*We set a call to grab every h2 within an article tag, and do the following:*/
            $("article").each(function (i, element) {

                /*Set the response or callback to save an empty result object*/
                let result = {};
                result.headline = $(element).find("h2").text().trim();
                result.url = 'https://www.nytimes.com' + $(element).find("a").attr("href");
                result.summary = $(element).find("p").text().trim();

                if (result.headline !== '' && result.summary !== '') {
                    db.headlineJS.findOne({ headline: result.headline }, function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            if (data === null) {
                                db.headlineJS.create(result)
                                    .then(function (dbArticle) {
                                        console.log(dbArticle)
                                    })
                                    .catch(function (err) {
                                        /*If there is an error, send it to the client console*/
                                        console.log(err)
                                    });
                            }
                            console.log(data)
                        }
                    });
                }

            });

            /*If we were able to successfully scrape and save an Article, send a message to the client*/
            res.send("Scrape completed!");
        });
    });

    /*Set a router to update all the headline articles*/
    router.put("/api/headlines/:id", function (req, res) {
        const saved = req.body.saved == 'true'
        if (saved) {
            db.headlineJS.updateOne({ _id: req.body._id }, { $set: { saved: true } }, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    return res.send(true)
                }
            });
        }
    });


    /*Set routing for our delete function from our controller*/
    router.delete("/api/headlines/:id", function (req, res) {
        console.log('reqbody:' + JSON.stringify(req.params.id))
        db.headlineJS.deleteOne({ _id: req.params.id }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                return res.send(true)
            }
        });
    });

    /*Set a routing function to Grab all notes/comments associated with each user for our articles*/
    router.get("/api/notes/:id", function (req, res) {
        db.headlineJS.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                console.log(dbArticle.note)
                res.json(dbArticle.note)
            })
            .catch(function (err) {
                res.json(err)
            })
    });


    /*Set a rounting call to allow user to delete notes/comments from our script the line #34 in our "notesController.js" file that we made*/
    router.delete("/api/notes/:id", function(req, res){
        console.log('reqbody:' + JSON.stringify(req.params.id))
        db.noteJS.deleteOne({_id: req.params.id}, function(err, result){
          if (err) {
            console.log(err)
          } else {
            return res.send(true)
          }
        });
    });

    /*Set routing call to post user requests to save notes/comments from */
    router.post("/api/notes", function(req, res){
        console.log(req.body)
        db.noteJS.create({ noteText: req.body.noteText })
        .then(function(dbNote){
          console.log('dbNote:' + dbNote)
          return db.headlineJS.findOneAndUpdate({ _id:req.body._headlineId}, 
          { $push: {note: dbNote._id} }, 
          {new: true})
        })
        .then(function(dbArticle){
          console.log('dbArticle:'+ dbArticle)
          res.json(dbArticle)
        })
        .catch(function(err){
          res.json(err);
        })
      });

    /*clear all articles from database*/
    router.get("/api/clear", function (req, res) {
        console.log(req.body);
        db.headlineJS.deleteMany({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.send(true);
            }
        })
    });
}