const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const { body, validationResult } = require("express-validator");

// file contains routes for creating, deleting and logging in/out users

// get all users
router.get("/", (req, res) => {
  User.findAll({
    attributes: [{ exclude: "password" }],
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(404).json({ message: "No users found" });
    });
});

// Return a single user
router.get("/:id", (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: "post",
      attributes: ["title"],
    },
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(404).json({ message: "User not found" });
    });
});

router.post(
  "/",
  body("username").isLength({ min: 1 }).trim().escape(),
  body("password").isLength({ min: 1 }).trim().escape(),
  body("email").isEmail().trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({});
    }
    User.create({
      username: req.params.username,
      email: req.params.email,
      password: req.params.password,
    })
      .then((response) => {
        req.session.save(() => {
          req.session.user_id = response.user_id;
          req.session.username = response.username;
          req.session.loggedIn = true;
        });
      })
      .catch((err) => {
        res.status(400).json({ message: err });
      });
  }
);

router.post(
  "/login",
  body("username").isLength({ min: 1 }).escape(),
  body("password").isLength({ min: 1 }).escape(),
  (req, res) => {
    User.findOne({
      where: {
        username: req.body.username,
      },
    }).then((loginData) => {
      if (!loginData) {
        window.prompt("No such user found!");
        return;
      }

      req.session.save(() => {
        req.session.user_id = loginData.id;
        req.session.username = loginData.username;
        req.session.loggedIn = true;

        window.prompt("You are now logged in!");
      });
    });
  }
);

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    res.session.destroy(() => {
      res.status(404).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;