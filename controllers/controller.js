var express = require("express");

var router = express.Router();

let newsScraper = require('../scrapers/newsScraper')
// Import the model (article.js) to use  its database functions.
var article = require("../models/Article.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
  article.find().limit(10).then(function ( data) {
    var hbsObject = {
      articles: data    
    };
    res.render("index", hbsObject);
  });
});
router.get("/about", function (req, res) {
    res.render("about");
  });
router.get("/utils", function (req, res) {
    res.render("utilities");
  });
router.get("/clear", function (req, res) {
  console.log("Clear");
  article.find().deleteMany().exec();  
  res.render("utilities");
  });

router.get("/saved", function (req, res) {
  article.find().limit(10).then(function ( data) {
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
  console.log(condition);
  article.update({
    saved: true
  }, condition, function (result) {
    if (result.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).render("saved");
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
