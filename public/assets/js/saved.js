$(document).ready(function () {
    /*We reference the article div that houses all the articles where we will be rendering all articles inside of it*/
    const articleContainer = $("#article-div");
    /*We add event listeners/controllers to handle functions that dynamically change the query of articles such as saving articles, deleting articles, and saving article notes or deleting article notes*/

    $(document).on("click", "#delete-btn", controllerArticleDelete);
    $(document).on("click", "#notes-btn", controllerArticleNotes);
    $(document).on("click", "#save-btn", controllerNoteSave);
    $(document).on("click", "#delete-note-btn", controllerNoteDelete);
    $("#clear").on("click", controllerArticleClear);

    function initPage() {
        /*Empty the article div once a new ajax function is calle to get new articles*/
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function (data) {

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
                $("<a class='btn btn-danger delete' id='delete-btn'>Delete From Saved</a>"),
                $("<a class='btn btn-info notes' id='notes-btn'>Article Notes</a>")
            )
        );

        const cardBody = $("<div class='card-body'>").text
        (article.summary)
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
            $(
                [
                    "<div class='alert alert-warning text-center'>",
                    "<h4>Looks like there are no saved articles.</h3>",
                    "</div>",
                    "<div class='card' id='card'>",
                    "<div class='card-header text-center'>",
                    "<h3 class='heading'>Would You Like to Browse Any Available Articles</h3>",
                    "</div>",
                    "<div class='card-body text-center'>",
                    "<h4><a href='/'>Search Articles to read</a></h4>",
                    "</div>",
                    "</div>"
                ].join(""));
        /*This adds the alert data above to the DOM*/
        articleContainer.append(emptyAlert);
    }

    function renderNotesQuery(data) {
        /*We set a function to rener the notes associated with our articles and render them to our notes model. We then arrange the notes into an array and set an constant for the script to svae each note*/
        const renderNotes = [];
        let presentNote;
        if (!data.notes.length) {
            /*We define what happens if no note is displayed, basically we will return a message to the user that no notes are displayed*/
            presentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            renderNotes.push(presentNote);
        } else {

            for (var i = 0; i < data.notes.length; i++) {

                presentNote = $("<li class='list-group-item note'>").text(data.notes[i].noteText)
                    .append($("<button class='btn btn-danger note-delete' id='delete-note-btn'>x</button>"));

                /*Here we program our script to save the note id to the delete button so when we delete the right note gets deleted from our models along with the DOM*/
                presentNote.children("button").data("_id", data.notes[i]._id);
                /*We then add our presentNote to the renderNotes array*/
                renderNotes.push(presentNote);
            }
        }
        /*We then append the renderNotes to the notes-div inside the note script*/
        $(".note-container").append(renderNotes);
    }

    function controllerArticleDelete() {
        /*We now define our article delete function for the saved page. Taking a closer look we must grab the relevant article id to delete from our article cards*/
        const deleteArticle = $(this).parents(".card").data();

        /*Get rid of card on page*/
        $(this).parents(".card").remove();

        /*We then use the JQUERY ajax call to send the delete request to our models/databse*/
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + deleteArticle._id
        }).then(function (data) {
            if (data.ok) {
                window.load = "/saved"
            }
        });
    }

    function controllerArticleNotes(event) {
        /*This function can handle opening our query of notes and displaying them in the DOM.*/
        const presentArticle = $(this).parents("#card").data();
        console.log(presentArticle);
        /*We use a "get" method to grab any notes associated with the headline/article id*/
        $.get("/api/notes/" + presentArticle._id).then(function(data) {
            console.log(data);
            const noteModelText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Notes For Article: " + presentArticle._id),
                $("<hr>"),
                $("<ul class='list-group note-container'>"),
                $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                $("<button class='btn btn-success save' id='save-btn'>Save Note</button>")
            );
            console.log(noteModelText);
            /*We now add our html components to the notes script*/
            bootbox.dialog({
                message: noteModelText,
                closeButton: true
            });
            const noteData = {
                _id: presentArticle._id,
                notes: data || []
            };
            console.log("noteData:" + JSON.stringify(noteData))
            /*We then tie together are connected notes to the relevant article and tie their ids to our powerful save button*/
            $("#save-btn").data("article", noteData);
            /*Here we set our renderNotesQuery function to populate the note HTML dynamically from the script we constructed*/
            renderNotesQuery(noteData);
        });
    }

    function controllerNoteSave() {
        /*We then define the function to save the user note created in the DOM while the article gets saved.
        We then set a constant to so our script can save the data*/
        let noteData;
        const newNote = $(".bootbox-body textarea").val().trim();
        /*We use a post method like deined in our routes to post new note information the user has typed in the DOM and then send it to our notes in our notes database/model*/

        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id, noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                /*Once everything has loaded this line lets use collapse the model*/
                bootbox.hideAll();
            })
        }
    }

    function controllerNoteDelete() {
        /*We then define the function to delete the user note that is associated while the article saved.
        We then set a constant to so our script can delete the data*/
        const deleteNote = $(this).data("_id");
        /*We then use a ajax method to send the delete request to our database/model with the id associated with the note we want to delete*/
        $.ajax({
            url: "/api/notes" + deleteNote,
            method: "DELETE"
        }).then(function () {
            /*Once everything has loaded this line lets use collapse the model*/
            bootbox.hideAll();
        });
    }

    function controllerArticleClear() {
        $.get("api/clear")
          .then(function(data) {
            articleContainer.empty();
            initPage() || location.reload();
          });
      }

});