const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({
      error: "username and password are required",
    });
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      // 400 Bad Request status code indicates that the server cannot or will not process the request due to a client error
      error: "username and password must be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  }); // populate the blogs field with the title, author, and url of each blog
  // this is similar to joining two tables in SQL
  // The argument given to the populate method defines that the ids referencing note objects in the notes field of the user document will be replaced by the referenced note documents.

  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs");

  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
})

module.exports = usersRouter;
