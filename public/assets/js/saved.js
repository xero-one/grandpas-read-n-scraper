$(document).ready(function() {
    /*We reference the article div that houses all the articles where we will be rendering all articles inside of it*/
    const articleDiv = $("#article-div");
    /*We add event listeners/controllers to handle functions that dynamically change the query of articles such as saving articles, deleting articles, and saving article notes or deleting article notes*/
    
    $(document).on("click", "#delete-btn", controllerArticleDelete);
    $(document).on("click", "#notes-btn", controllerArticleNotes);
    $(document).on("click", "#save-btn", controllerNoteSave);
    $(document).on("click", "#delete-note-btn", controllerNoteDelete);

    /*Life style-function that initializes the page*/
    initPage();

    initPage = () => {
        /*Empty the article div once a new ajax function is calle to get new articles*/
        articleDiv.empty();
        $.get("/api/headlines?saved=true").then(data = () => {
            /*Set a boolean if statement that pulls headlines if there are any*/
            if (data && data.length) {
                renderArticles(data);
            } else {
                /*Else render nothing but a message that says their are no available articles*/
                renderEmpty();
            }
        });
    }

    renderArticles = (articles) => {
        /*We construct a function that appends the articles to the HTML containing our article info/data to our page
        Then empty the available data through a JSON array*/
        const articleCards = [];

        /*Once the data from the JSON is passed it then gets added o our page with some nice HTMl/CSS properties*/
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
        /*In the last step we append what we have to our article div with our article cards*/
        articleDiv.append(articleCards);
    }

    constructCard = (article) => {
        /*Here we write out our direct article card html code dynamically with JQUERY to formatt our data to append to our page with nice HTML/CSS*/
        const card =
            $(["<div class='row card' id='card'>",
                "<div class='col s12'>",
                "<h2 class='heading'>",
                article.headline,
                "<a class='btn btn-danger' id='delete-btn'>",
                "Save Article",
                "</a>",
                "</h2>",
                "</div>",
                "<div class='summary-body'>",
                "<p>", article.summary, "</p>",
                "</div>",
                "</div>"
            ].join(""));

        /*Connect the article "_id" with the JQUERY script, this allows the script to keep track of wich article gets saved if a user want to save an article*/
        card.data("_id", article._id);
        /*return the card to DOM*/
        return card;
    }

    renderEmpty = () => {
        /*Here we send the user a nice decorative html message explaining the data/articles is not available and give the user request options to go to saved articles or to scrape-new*/
        const emptyAlert =
            $([
                "<div class='row alert'>",
                "<div class='col s12 text-center'>",
                "<h4>Looks like there are no saved articles.</h3>",
                "</div>",
                "<div class='col s12 card text-centered'>",
                "<h3 class='heading'>Would You Like to Browse Any Available Articles</h3>",
                "</div>",
                "<div class='col s12 text-centered'>",
                "<h4><a class='scrape-new' id='scrape-new'>Scrape New Articles to Read</a></h4>",
                "<h4><a href='/'>Search Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        /*This adds the alert data above to the DOM*/
        articleDiv.append(emptyAlert);
    }

    renderNotesQuery = (data) => {
        /*We set a function to rener the notes associated with our articles and render them to our notes model. We then arrange the notes into an array and set an constant for the script to svae each note*/
        const renderNotes = [];
        const presentNote;
        if (!data.notes.length) {
            /*We define what happens if no note is displayed, basically we will return a message to the user that no notes are displayed*/
            presentNote = [
                "<li class='list-group-item'>",
                "There are no notes for this article yet",
                "</li>"
            ].join("");
            renderNotes.push(presentNote);
        } else {

            for (var i = 0; i < data.notes.length; i++) {

                presentNote = $([
                    "<li class='list-group-item note' id='note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger' id='delete-note-btn'>X</button>",
                    "</li>"
                ].join(""));
                /*Here we program our script to save the note id to the delete button so when we delete the right note gets deleted from our models along with the DOM*/
                presentNote.children("button").data("_id", data.notes[i]._id);
                /*We then add our presentNote to the renderNotes array*/
                renderNotes.push(presentNote);
            }
        }
        /*We then append the renderNotes to the notes-div inside the note script*/
        $("#article-div").append(renderNotes);
    }

    controllerArticleDelete = () => {
        /*We now define our article delete function for the saved page. Taking a closer look we must grab the relevant article id to delete from our article cards*/
        const deleteArticle = $(this).parents("#card").data();
        /*We then use the JQUERY ajax call to send the delete request to our models/databse*/
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + deleteArticle._id
        }).then(data = () => {
            if (data.ok) {
                initPage();
            }
        });
    }

    controllerArticleNotes = () => {
        /*This function can handle opening our query of notes and displaying them in the DOM.*/
        const presentArticle = $(this).parents("#card").data();
        /*We use a "get" method to grab any notes associated with the headline/article id*/
        $.get("/api/notes/" + presentArticle._id).then(data = () => {
            const noteModelText = [
                "<div class='row fluid-container'>",
                "<div class='text-center'>",
                "<h3>Articles Notes: ",
                presentArticle._id,
                "</h3>",
                "<hr />",
                "<ul class='list-group' id='note-div'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='5' cols='60'></textarea>",
                "<button class='btn btn-sucess save' id='save-btn'>Save Note</button>",
                "</div>",
                "</div>"
            ].join("");
            /*We now add our html components to the notes script*/
            bootbox.dialog({
                message: noteModelText,
                closeButton: true
            });
            const noteData = {
                _id: presentArticle._id,
                notes: data || []
            };
            /*We then tie together are connected notes to the relevant article and tie their ids to our powerful save button*/
            $("#save-btn").data("article", noteData);
            /*Here we set our renderNotesQuery function to populate the note HTML dynamically from the script we constructed*/
            renderNotesQuery(noteData);
        });
    }

    controllerNoteSave = () => {
        /*We then define the function to save the user note created in the DOM while the article gets saved.
        We then set a constant to so our script can save the data*/
        const noteData;
        const newNote = $(".bootbox-body textarea").val().trim();
        /*We use a post method like deined in our routes to post new note information the user has typed in the DOM and then send it to our notes in our notes database/model*/

        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                /*Once everything has loaded this line lets use collapse the model*/
                bootbox.hideAll();
            })
        }
    }

    controllerNoteDelete = () => {
        /*We then define the function to delete the user note that is associated while the article saved.
        We then set a constant to so our script can delete the data*/
        const deleteNote = $(this).data("_id");
        /*We then use a ajax method to send the delete request to our database/model with the id associated with the note we want to delete*/
        $.ajax({
            url: "/api/notes" + deleteNote,
            method: "DELETE"
        }).then(function() {
            /*Once everything has loaded this line lets use collapse the model*/
            bootbox.hideAll();
        });
    }

});