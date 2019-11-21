/*Set constant variable to call the data from the exported "noteJS" script in the "noteModel.js" file and model*/
const noteJS = require("../models/noteModel");

/*Set constant variable to create a date stamp the data from the exported "createDate" script in the "date.js" file*/
const createDate = require("../scripts/date");

/*Let us construct a "fetch" function that calls the data from our models and loops the data within a nice for loop variable*/
module.exports = {
    get: (data, callback) => {
        noteJS.find({
            _headlineId: data._id}, callback);
    }
    
}