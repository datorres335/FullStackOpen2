const commentsRouter  = require("express").Router();
const Comment = require("../models/comment");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");

commentsRouter.get("/", async (request, response) => {
  const comments = await Comment.find({})
  response.json(comments);
})

commentsRouter.post("/", userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({error: "token invalid"});
  }

  const blog = await Blog.findById(request.body.blogId);
  if (!blog) {
    return response.status(400).json({ error: "blogId missing or not valid" });
  }

  const comment = new Comment({
    content: request.body.content,
    blogId: blog._id,
    userId: decodedToken.id
  })
  const savedComment = await comment.save();
  blog.comments = blog.comments.concat(savedComment._id);
  await blog.save();

  if (savedComment) {
    response.status(201).json(savedComment);
  } else {
    response.status(400).json({ error: "Comment could not be created" });
  }
})

module.exports = commentsRouter;