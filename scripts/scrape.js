/*Begin our constant defines and require calls==================================================*/

/*Set constant variable for npm cheerio*/
const cheerio = require("cheerio");

/*Set constant variable for npm caxios to call articles from NYT*/
const axios = require("axios");

/*Let us construct a variable that fetches the data or articles from the New York Times website*/
let scrapeData = callback => {
    axios.get("http://www.nytimes.com", function(err, res, body) {

        let $ = cheerio.load(body);

        /*Empty the articles into an array*/
        let articles = [];

        $(".theme-summary").each(function(i, element) {

            /*Trim any unnecessary characters included in the targeted "fetched" data */
            let headingFromNYT = $(this).children(".css-12vidh").text().trim();
            let summaryFromNYT = $(this).children(".css-1gh531").text().trim();

            /*Conditionals if info is avaliable format the text or pretify it with a regex method*/
            if(headingFromNYT && summaryFromNYT) {
                
                let headingPrettify = headingFromNYT.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                let summaryPrettify = summaryFromNYT.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                /*Take the fetched data parse it into an object so it can be stored into our db models*/
                let fetchedData = {
                    headline: headingPrettify,
                    summary: summaryPrettify
                };

                /*Push the feched data into our res array*/
                articles.push(fetchedData);
            }

        });

        /*call the callback function with new articles from our models*/
        callback(articles);
    })
}

/*Export the important fetch function so it can be referred to throughout the rest of the app*/
module.exports = scrapeData;