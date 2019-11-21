/*Set constant variable to call the data from the exported "noteJS" script in the "noteModel.js" file and model*/
const noteJS = require("../models/noteModel");

/*Set constant variable to create a date stamp the data from the exported "createDate" script in the "date.js" file*/
const createDate = require("../scripts/date");

/*Let us construct a "get" function that calls the data from our models and loops the data within a nice for loop variable*/
module.exports = {
    /*Get all notes associated with the articles from users*/
    get: (data, callback) => {
        noteJS.find({
            _headlineId: data._id}, callback);
    },

    /*Save function for the a new note produced from a user*/
    save: (data, callback) => {
        let saveNote = {
            _headlineId: data._id,
            date: createDate(),
            noteText: data.noteText
        };
        /*Creates new note dynamically to callback function*/
        noteJS.create(saveNote, (err, doc) => {
            if (err) {
                console.log("Here is whats wrong: " + err);
            }
            else {
                console.log(doc);
                callback(doc);
            }
        });
    },

    /*In case the user wants to delete an article this line allows that*/
    delete: (data, callback) => {
        noteJS.remove({_id: data._id}, callback);
    }
}