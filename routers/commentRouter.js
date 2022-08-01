const express = require("express");
const { commentController } = require("../controllers");
const routers = express.Router();

routers.post("/get/:postId/:idx/:count", commentController.getComments);
routers.get("/commentsLength/:postId", commentController.getCommentsLength);
routers.post("/add", commentController.addComment);
routers.post("/edit", commentController.editComment);
routers.post("/delete/:id", commentController.deleteComment);

module.exports = routers;
