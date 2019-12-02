/*Begin our constant defines and require calls==================================================*/

/*Set constant variable for npm cheerio*/
const cheerio = require("cheerio");

/*Set constant variable for npm caxios to call articles from NYT*/
const axios = require("axios");

/*Let us construct a variable that fetches the data or articles from the New York Times website*/
let scrapeData = callback => {
    axios.get("http://www.nytimes.com", function (err, res, body) {

        let $ = cheerio.load(body);

        /*Empty the articles into an array*/


        $("article").each(function (i, element) {
            let result = {};
            /*Trim any unnecessary characters included in the targeted "fetched" data */

            result.headline = $(element).find("h2").text().trim();

            result.url = 'https://www.nytimes.com' + $(element).find("a").attr("href");

            result.summary = $(element).find("p").text().trim();

            if (result.headline !== "" && result.summary !== "") {
              
                headlineJS.findOne({ headline: result.headline }, function (err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        if (data === null) {
                            headlineJS.create(result).then(function (dbHeadlineJS) {
                                console.log(dbHeadlineJS)
                            }).catch(function (err) {
                                /*If an error occurred, send it to the client*/
                                console.log(err)
                            });
                        }
                        console.log(data)
                    }
                });
            }

            callback(result);

        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape completed!");
    });

}
/*Export the important fetch function so it can be referred to throughout the rest of the app*/
module.exports = scrapeData;
