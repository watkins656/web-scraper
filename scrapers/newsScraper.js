// Parses our HTML and helps us find elements
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/onion");
var cheerio = require("cheerio");

// Makes HTTP request for HTML page
var axios = require("axios");
var db = require("../models");

newsScraper ={

  scrape: () => {
    
    // First, tell the console what server.js is doing
console.log("\n***********************************\n" +
  "Grabbing every Onion Article\n" +
  "from the Onion homepage:" +
  "\n***********************************\n");

  
    // Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
    axios.get("https://www.theonion.com/").then(function (response) {
      console.log("response recieved...");
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];
  
  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  let articles = {
    total: 0,
    added: 0,
    alreadyExists: 0
  }
  $("article").each(function (i, element) {
    
    let headline = ($(element).children().children('.headline').text());
    let category = ($(element).children('.meta--pe').children().children().children().text());
    let link = $(element).children('.item__content').children('.asset').children().attr("href");
    let img = $(element).children('.item__content').children('.asset').children().children().children().children('img').attr('src');
    let excerpt = $(element).children('.item__content').children('.excerpt').text();
    
    let result = {
      headline: headline,
      category: category,
      link: link,
      img: img,
      excerpt: excerpt,
    }
    // Save these results in an object that we'll push into the results array we defined earlier
    db.Article.findOne({ headline: headline })
    .then(item => {
      articles.total++;
        if (item == null) {
          articles.added++;
          console.log("adding result");
          results.push(result);
          db.Article.create(result)
            .then(function (dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function (err) {
              // If an error occurred, log it
              console.log(err);
            });
        }
        else {
          articles.alreadyExists++;
          console.log("result already exists");
          return
        }
      }).catch(err=>console.log(err));
      
    });
  // Log the results once you've looped through each of the elements found with cheerio
});
}
} 

module.exports = newsScraper;
