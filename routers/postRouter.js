const express = require("express");
const { postController } = require("../controllers");
const routers = express.Router();

routers.get("/getUserPosts/:userId/:idx/:count", postController.getUserPosts);
routers.get("/getPosts/:idx/:count", postController.getPosts);
routers.get("/details/:postId", postController.postDetail);
routers.post("/editCaption", postController.editCaption);
routers.post("/deletePost/:postId", postController.deletePost);

module.exports = routers;
