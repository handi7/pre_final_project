const db = require("../database").promise();
const { uploader } = require("../helper/uploader");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

module.exports = {
  uploadProfileImg: async (req, res) => {
    try {
      let path = "/profile-img";
      const upload = uploader(path, "Profile").fields([{ name: "file" }]);

      upload(req, res, async (error) => {
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }

        const { file } = req.files;
        let updateQuery = `update users set profileImg = ? where id = ?;`;
        const oldPath = `../capture/public/${path}/${req.body.oldImg}`;

        await db.execute(updateQuery, [file[0].filename, req.body.userId]);
        if (req.body.oldImg) {
          await unlinkAsync(oldPath);
        }

        res.status(200).send({ message: "Upload success." });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  uploadPost: async (req, res) => {
    try {
      let path = "/posts";
      const upload = uploader(path, "Post").fields([{ name: "file" }]);

      upload(req, res, async () => {
        const { caption, userId, timePost } = req.body;
        const insertQuery = `Insert into posts values (null, ?, ?, ?, ?);`;

        await db.execute(insertQuery, [
          userId,
          req.files.file[0].filename,
          caption,
          timePost,
        ]);
        res.status(200).send("Uploaded");
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
