$(document).ready(function () {
    /*We reference the article div that houses all the articles where we will be rendering all articles inside of it*/
    const articleDiv = $("#article-div");
    $(document).on("click", "#save-btn", controllerSaveArticle);
    $(document).on("click", "#scrape-new", controllerScrapeArticle);

    /*Life style-function that initializes the page*/
    initPage();

    function initPage() {
        /*Empty the article div once a new ajax function is calle to get new articles*/
        articleDiv.empty();
        $.get("/api/headlines?saved=false")
            .then(data => {
                /*Set a boolean if statement that pulls headlines if there are any*/
                if (data && data.length) {
                    renderArticles(data);
                } else {
                    /*Else render nothing but a message that says their are no available articles*/
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles) {
        /*We construct a function that appends the articles to the HTML containing our article info/data to our page
        Then empty the available data through a JSON array*/
        const articleCards = [];

        /*Once the data from the JSON is passed it then gets added o our page with some nice HTMl/CSS properties*/
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(constructCard(articles[i]));
        }
        /*In the last step we append what we have to our article div with our article cards*/
        articleDiv.append(articleCards);

    }

    function constructCard(article) {
        /*Here we write out our direct article card html code dynamically with JQUERY to formatt our data to append to our page with nice HTML/CSS*/
        const card =
            $(["<div class='row card' id='card'>",
                "<div class='col s12'>",
                "<h2 class='heading'>",
                article.headline,
                "<a class='btn btn-danger' id='save-btn'>",
                "Save Article",
                "</a>",
                "</h2>",
                "</div>",
                "<div class='summary-body'>",
                "<p>",article.summary,"</p>",
                "</div>",
                "</div>"
            ].join(""));

        /*Connect the article "_id" with the JQUERY script, this allows the script to keep track of wich article gets saved if a user want to save an article*/    
        card.data("_id", article._id);
        /*return the card to DOM*/
        return card;
    }
     

    function renderEmpty() {
        /*Here we send the user a nice decorative html message explaining the data/articles is not available and give the user request options to go to saved articles or to scrape-new*/
        const emptyAlert = 
            $([
                "<div class='row alert'>",
                "<div class='col s12 text-center'>",
                "<h4>Looks like there are no articles at this time, please check again later...</h3>",
                "</div>",
                "<div class='col s12 card text-centered'>",
                "<h3 class='heading'>Select what you want to do next</h3>",
                "</div>",
                "<div class='col s12 text-centered'>",
                "<h4><a class='scrape-new' id='scrape-new'>Scrape New Articles to Read</a></h4>",
                "<h4><a href='/saved'>Go to Your Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        /*This adds the alert data above to the DOM*/    
        articleDiv.append(emptyAlert);
    }

   function controllerSaveArticle() {
        /*We must create the function to allow the user to save the article based on the information we appened with the card. We then add the article id to be saved using the .data method*/
        const saveArticle = $(this).parents("#card").data();
        saveArticle.saved = true;
        /*We then use the ajax "PATCH" method to update the data with what is in the process of being saved*/
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: saveArticle
        })
        .then(function(data) {
            /*If the functions runs and data is patched through mongoose will return a value of "1" which means true*/
            if (data.ok) {
                /*The initialize the page again using "initPage" to reload the articles*/
                initPage();
            }
        });    
    }

    function controllerScrapeArticle() {
        /*We now define our article "scrape" controller/button and tell it what we want it to do */
        $.get("/api/fetch")
        /*Once the articles are scraped and we have evaluated our articles to those in our collection, we then tell the script to render the page followed by an alert that tells the user how many articles they have saved*/
            .then(function(data) {
                initPage();
                bootbox.alert("<h3 class='text-center'>" + data.message + "</h3>");
            });
    }
});