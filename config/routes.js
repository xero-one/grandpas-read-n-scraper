module.exports = function(router) {
    /*Set the router to get or render the home webpage components of our website to route to the default path "/"*/
    router.get("/", function(req, res) {
        res.render("home");
    });

    /*Set the router to get or render the saved webpage components of our website to route to path "/" + "saved"*/
    router.get("/saved", function(req, res) {
        res.render("saved");
    });
}