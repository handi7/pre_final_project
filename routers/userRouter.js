const express = require("express");
const { userController } = require("../controllers");
const { auth } = require("../helper/authToken");
const routers = express.Router();

routers.get("/get/:id", userController.getUser);
routers.post("/login", userController.login);
routers.post("/keepLogin", userController.keepLogin);
routers.post("/register", userController.register);
routers.post("/check/", userController.check);
routers.post("/resend", userController.resend);
routers.post("/sendReset", userController.sendReset);
routers.get("/checkLink/:token", userController.checkLink);
routers.patch("/reset", userController.reset);
routers.get("/getToken/:token", userController.getToken);
routers.patch("/verified", auth, userController.verification);
routers.patch("/edit/:id", userController.editData);

module.exports = routers;
