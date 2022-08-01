const db = require("../database").promise();
const fs = require("fs");
const multer = require("multer");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports = {
  getPosts: async (req, res) => {
    try {
      let scriptQuery = `select * from posts order by postId desc limit ?,?;`;
      const [result] = await db.execute(scriptQuery, [
        req.params.idx,
        req.params.count,
      ]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const scriptQuery = `select * from posts where userId = ? order by postId desc limit ?,?;`;
      // let scriptQuery = `select * from posts where userId = ?;`;
      const [result] = await db.execute(scriptQuery, [
        req.params.userId,
        req.params.idx,
        req.params.count,
      ]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  },

  postDetail: async (req, res) => {
    try {
      const getQuery = `select p.postId, p.userId, p.imagePost, p.caption, p.timePost,
      u.firstName, u.lastName, u.username, u.profileImg
      from posts p join users u on p.userId = u.id where p.postId = ?;`;

      const [result] = await db.execute(getQuery, [req.params.postId]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  getCaption: async (req, res) => {
    let getQuery = `select *`;
  },

  upload: async (req, res) => {
    const { caption, userId, firstName, lastName, username, timePost } =
      req.body;

    let insertQuery = `Insert into posts values (null, ?, ?, ?, ?);`;

    try {
      const [result] = await db.execute(insertQuery, [
        userId,
        req.file.filename,
        caption,
        timePost,
      ]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  },

  editCaption: async (req, res) => {
    const { caption, postId } = req.body;
    let updateQuery = `update posts set caption = ? where postId = ?;`;

    try {
      await db.execute(updateQuery, [caption, postId]);
      res.status(200).send("Caption updated.");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  deletePost: async (req, res) => {
    let deleteQuery = `delete from posts where postId = ?;`;
    let deleteComments = `delete from comments where postId = ?;`;
    let deleteLikes = `delete from likes where postId = ?;`;
    const imgPath = `../capture/public/posts/${req.body.imgName}`;

    try {
      await db.execute(deleteQuery, [req.params.postId]);
      await db.execute(deleteComments, [req.params.postId]);
      await db.execute(deleteLikes, [req.params.postId]);
      await unlinkAsync(imgPath);
      res.status(200).send("deleted.");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
