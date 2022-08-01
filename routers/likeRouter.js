const express = require("express");
const { likeController } = require("../controllers");
const routers = express.Router();

routers.get("/getLiked/:id", likeController.getLiked);
routers.get("/isLiked/:userId/:postId", likeController.isLiked);
routers.get("/postLikes/:postId", likeController.postLikes);
routers.post("/addLike", likeController.addLike);
routers.delete("/delete/:postId/:userId", likeController.delete);

module.exports = routers;
