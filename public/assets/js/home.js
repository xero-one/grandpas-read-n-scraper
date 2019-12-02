$(document).ready(function () {
    /*We reference the article div that houses all the articles where we will be rendering all articles inside of it*/
    const articleContainer = $("#article-div");
    $(document).on("click", "#save-btn", controllerSaveArticle);
    $(document).on("click", "#scrape-new", controllerScrapeArticle);
    $("#clear").on("click", controllerArticleClear);

    function initPage() {
        /*Empty the article div once a new ajax function is called to get new articles*/
        
        $.get("/api/headlines?saved=false")
            .then(function(data) {
                articleContainer.empty();
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
        articleContainer.append(articleCards);

    }

    function constructCard(article) {
        /*Here we write out our direct article card html code dynamically with JQUERY to formatt our data to append to our page with nice HTML/CSS*/
        const card = $("<div class='card' id='card'>");
        const cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", article.url)
                    .text(article.headline),
                $("<a class='btn btn-dark save' id='save-btn'>Save Article</a>")
            )
        );

        const cardBody = $("<div class='card-body' id='card-body'>").text(article.summary)
        .text(article.date)
        card.append(cardHeader, cardBody);

        /*Connect the article "_id" with the JQUERY script, this allows the script to keep track of wich article gets saved if a user want to save an article*/
        card.data("_id", article._id);
        /*return the card to DOM*/
        return card;
    }


    function renderEmpty() {
        /*Here we send the user a nice decorative html message explaining the data/articles is not available and give the user request options to go to saved articles or to scrape-new*/
        const emptyAlert =
            $([
                "<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
                "</div>",
                "<div class='card' id='card'>",
                "<div class='card-header text-center'>",
                "<h3>What Would You Like To Do?</h3>",
                "</div>",
                "<div class='card-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        /*This adds the alert data above to the DOM*/
        articleContainer.append(emptyAlert);
    }

    function controllerSaveArticle() {
        /*We must create the function to allow the user to save the article based on the information we appened with the card. We then add the article id to be saved using the .data method*/
        const saveArticle = $(this).parents("#card").data();

        $(this).parents("#card").remove();

        saveArticle.saved = true;
        console.log(saveArticle)
        /*We then use the ajax "PATCH" method to update the data with what is in the process of being saved*/
        $.ajax({
            method: "PUT",
            url: "/api/headlines/" + saveArticle._id,
            data: saveArticle
        })
            .then(function(data) {
                console.log(date);
                /*If the functions runs and data is patched through mongoose will return a value of "1" which means true*/
                if (data.ok) {
                    /*The initialize the page again using "initPage" to reload the articles*/
                    initPage() || location.reload();
                }
            });
    }

    function controllerScrapeArticle() {
        /*We now define our article "scrape" controller/button and tell it what we want it to do */
        $.get("/api/fetch")
            /*Once the articles are scraped and we have evaluated our articles to those in our collection, we then tell the script to render the page followed by an alert that tells the user how many articles they have saved*/
            .then(function(data) {
                console.log(data);
                initPage();
                window.location.href = "/";
            });
    }

    function controllerArticleClear() {
        $.get("api/clear")
          .then(function(data) {
            articleContainer.empty();
            // initPage();
            location.reload();
          });
      }
      
});