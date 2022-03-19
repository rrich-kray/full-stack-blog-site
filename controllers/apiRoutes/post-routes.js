const router = require("express").Router();
const { Post, Comment, User } = require("../../models");
const { body, validationResult } = require("express-validator");

// file contains routes for creating, editing and deleting posts

// create a post. Post will automatically be assigned id through sequelize model

// Get all posts
router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "title", "content", "user_id"],
    include: {
      model: Comment,
      attributes: ["content"],
      include: {
        model: User,
        attributes: ["username"],
      },
    },
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

// Get a single post
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "user_id"],
    include: {
      model: Comment,
      attributes: ["content"],
      include: {
        model: User,
        attributes: ["username"],
      },
    },
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

router.post(
  "/",
  [
    body("title").exists().isLength({ min: 1 }).trim().escape(),
    body("content").exists().isLength({ min: 1 }).escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Post was unsuccessful");
      Promise.reject("Post was unsuccessful");
    }

    Post.create({
      title: req.body.title,
      content: req.body.content,
      created_at: req.body.created_at,
    })
      .then((response) => {
        console.log("post was successful!");
      })
      .catch((err) => res.status(400).json({ message: err }));
  }
);

// update a post
router.put("/:id", (req, res) => {
  Post.update({
    title: req.body.title,
    content: req.body.content,
  })
    .then((response) => {
      console.log(response);
      window.prompt("Post updated!");
    })
    .catch((err) => {
      window.prompt(`Could not update post. Error: ${err.message}`);
      res.status(400).json({ message: err.message });
    });
});

// delete a post
router.delete("/:id", (req, res) => {
  Post.destroy({
    where: { id: req.params.id },
  })
    .then((response) => {
      response.statusText;
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

module.exports = router;