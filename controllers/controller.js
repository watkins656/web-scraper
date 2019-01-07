var express = require("express");

var router = express.Router();

let newsScraper = require('../scrapers/newsScraper')
// Import the model (article.js) to use  its database functions.
var article = require("../models/Article.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
  article.find().limit(10).then(function ( data) {
    console.log(typeof data)
console.log("Array?" + Array.isArray(data));
data.forEach(item=>console.log(item))
    // console.log("data:" +data);
    var hbsObject = {
      articles: data    
    };
    res.render("index", hbsObject);
  });
});
router.get("/about", function (req, res) {
    res.render("about");
  });

router.get("/saved", function (req, res) {
  article.find().limit(10).then(function ( data) {
    console.log(typeof data)
console.log("Array?" + Array.isArray(data));
data.forEach(item=>console.log(item))
    // console.log("data:" +data);
    var hbsObject = {
      articles: data    
    };
    res.render("saved", hbsObject);
  });
});

router.get("/scrape", function(req, res){
  let data = newsScraper.scrape();
res.send(data)
})

router.post("/api/articles", function (req, res) {
  article.create([
    "name", "sleepy"
  ], [
      req.body.name, req.body.sleepy
    ], function (result) {
      // Send back the ID of the new quote
      res.json({ id: result.insertId });
    });
});

router.put("/api/articles/:id", function (req, res) {
  var condition = "id = " + req.params.id;

  console.log("condition", condition);

  article.update({
    sleepy: req.body.sleepy
  }, condition, function (result) {
    if (result.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

router.delete("/api/articles/:id", function (req, res) {
  var condition = "id = " + req.params.id;

  article.delete(condition, function (result) {
    if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

// Export routes for server.js to use.
module.exports = router;
