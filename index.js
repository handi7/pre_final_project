const express = require("express");
const cors = require("cors");
const path = require("path");
const bearerToken = require("express-bearer-token");

const PORT = 2000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bearerToken());
app.use(express.static(path.join(__dirname, "public")));

const { userRouter } = require("./routers");
const { postRouter } = require("./routers");
const { likeRouter } = require("./routers");
const { commentRouter } = require("./routers");
const { uploadRouter } = require("./routers");

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/like", likeRouter);
app.use("/comment", commentRouter);
app.use("/upload", uploadRouter);

app.listen(PORT, () => console.log("Api Running: ", PORT));
