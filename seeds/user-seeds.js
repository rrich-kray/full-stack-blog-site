const User = require("../models/User");

const userData = [
  {
    username: "user1",
    email: "user1@gmail.com",
    password: "password",
  },
  {
    username: "user2",
    email: "user2@gmail.com",
    password: "password",
  },
  {
    username: "user3",
    email: "user3@gmail.com",
    password: "password",
  },
  {
    username: "user4",
    email: "user4@gmail.com",
    password: "password",
  },
  {
    username: "user5",
    email: "user5@gmail.com",
    password: "password",
  },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
