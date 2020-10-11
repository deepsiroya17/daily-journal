const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Journaling might be the most underrated activity that can boost your productivity and well-being in just a few minutes a day. Just jot your thoughts down or record what happened during the day for a simple way to manage stress, enhance creativity, increase happiness, improve health, and increase work performance.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-deep:deep729@cluster0.3lau6.mongodb.net/blogDB", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err,posts) {
    res.render("home", {homeStartingContent,posts});
  });
})

app.get("/about", function(req, res) {
  res.render("about");
})

app.get("/compose", function(req, res) {
  res.render("compose");
})

app.post("/compose", function(req, res) {
  const post = new Post ({
    title: _.capitalize(req.body.postTitle),
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const postid = req.params.postId;

  Post.findOne({_id: postid}, function(err,post) {
    const title = _.capitalize(post.title)
    res.render("post", {title: title, content: post.content, comid: postid});
  });
});

app.post("/delete", function(req, res) {
  const postClicked = req.body.clicked;

  Post.findByIdAndRemove(postClicked, function(err) {
    if(!err) {
        console.log("Successfully deleted");
        res.redirect("/");
      }
  })
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
}););
