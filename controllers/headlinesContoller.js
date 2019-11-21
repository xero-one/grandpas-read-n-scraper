/*Set constant variable to scrape the data from the exported "scrapeData" script in the "scrape.js" file*/
const scrapeData = require("../scripts/scrape");

/*Set constant variable to create a date stamp the data from the exported "createDate" script in the "date.js" file*/
const createDate = require("../scripts/date");

/*Set constant variable to scrape the data from the exported "createDate" script in the "date.js" file*/
const headlineJS = require("../models/headlineModel");

/*Let us construct a "fetch" function that calls the data from our models and loops the data within a nice for loop variable*/
module.exports = {

    fetch: callback => {
        scrapeData(function(data) {
            let articles = data;
            for (let i=0; i < articles.length; i++) {
                articles[i].data = createDate();
                articles[i].saved = false;
            }
            
            headlineJS.collection.insertMany(articles, {ordered: false}, function(err, docs) {
                callback(err, docs);
            });
        });
    },

    /*Retrive all items with our basic get function and sort the data*/
    get: (query, callback) => {
        headlineJS.find(query).sort({ _id: -1 }).exec((err, doc) => { callback(doc); });
    },

    /*Function to update articles*/
    update: (query, callback) => {
        headlineJS.update({_id: query._id}, {
            $set: query
        }, {}, callback);
    },
        
    /*In case the user wants to delete an article this line allows that*/
    delete: (query, callback) => {
        headlineJS.remove(query, callback);
    }
}