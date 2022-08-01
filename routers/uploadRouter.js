const express = require("express");
const { uploaderController } = require("../controllers");
const route = express.Router();

route.post("/uploadProfile", uploaderController.uploadProfileImg);
route.post("/uploadPost", uploaderController.uploadPost);

module.exports = route;
