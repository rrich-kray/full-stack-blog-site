const { Post } = require("../models/Post");
const sequelize = require("../config/connection");
const router = require("express").Router();

//get all posts
router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["title"],
    include: {
      model: "user",
      attributes: ["username"],
    },
  }).then((postData) => {
    const posts = postData.map(postData.get({ plain: true }));
    res.render("homepage", posts);
  });
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
  }).then((response) => {
    const post = response.get({ plain: true });
    res.render("single-post", post);
  });
});

module.exports = router;
