/*Set constant variable to scrape the data from the exported "scrapeData" script in the "scrape.js" file*/
const scrapeData = require("../scripts/scrape");

/*Set a constant variable to call in our Headline file controller code from our controllers directory*/
const headlinesCotrollerJS = require("../controllers/headlinesContoller");

/*Set a constant variable to call in our Headline file controller code from our controllers directory*/
const notesControllerJS = require("../controllers/notesController");

module.exports = router => {
    /*Set the router to get or render the home webpage components of our website to route to the default path "/"*/
    router.get("/", (req, res) => {
        res.render("home", { home: true, article : data });
    });

    /*Set the router to get or render the saved webpage components of our website to route to path "/" + "saved"*/
    router.get("/saved", (req, res) => {
        res.render("saved", { home: false, article : data });
    });

    /*API routing for middleware to render all api data fetched from our code*/
    router.get("/api/fetch", (req, res) => {
        headlinesCotrollerJS.fetch((err,docs) => {
            if (docs === false || docs.insertedCount === 0) {
                res.json({
                    message: "No articles available right now... please check again later" 
                });
                console.log("No articles available right now... please check again later.\n Here is the error status\n" + 
                err);
            }
            else {
                res.json({
                    message: docs.insertedCount + " articles qued and added!" 
                })
                console.log(docs.insertedCount + " articles qued and added!");
            }
        })});

    /*Query is used for user req and headline info gets retreived*/
    router.get("/api/headlines", (req, res) => {
        let query = {};
        if (req.query.saved) {
            query = req.query;
        }

        headlinesCotrollerJS.get(query, data => {
            res.json(data);
        });
    });

    /*Set a router to update all the headline articles*/
    router.patch("/api/headlines", (req, res) => {
        headlinesCotrollerJS.update(re.body, (req, res) => {
            res.json(data);
        });
    });

    /*Set routing for our delete function from our controller*/
    router.delete("/api/headlines/:id", (req, res) => {
        let query = {};
        query._id = req.params.id;
        headlinesCotrollerJS.delete(query, (err, data) => {
            res.json(data);
        });
    });

    /*Set a routing function to Grab all notes/comments associated with each user for our articles*/
    router.get("/api/notes/:headline_id", (req, res) => {
        let query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }

        notesControllerJS.get(query, (err, data) => {
            res.json(data);
        });
    });

    /*Set a rounting call to allow user to delete notes/comments from our script the line #34 in our "notesController.js" file that we made*/
    router.delete("/api/notes/:id", (req, res) => {
        let query = {};
        query._id = req.params.id;
        notesControllerJS.delete(query, (err, data) => {
            res.json(data);
        });
    });

    /*Set routing call to post user requests to save notes/comments from */
    router.post("/api/notes", (req, res) => {
        notesControllerJS.save(req.body, data => {
            res.json(data);
        });
    });


    /*clear all articles from database*/
    router.get("/api/clear", function(req, res){
        console.log(req.body);
        headlineJS.deleteMany({}, function(err, result){
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(true);
        }
        })
  });
}