const db = require("../database").promise();

module.exports = {
  addComment: async (req, res) => {
    try {
      const { postId, userId, comment, date } = req.body;
      const insertQuery = `insert into comments values (null, ?, ?, ?, ?);`;

      const [result] = await db.execute(insertQuery, [
        postId,
        userId,
        comment,
        date,
      ]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  getComments: async (req, res) => {
    try {
      const getQuery = `select c.id, c.postId, c.userId, c.comment, c.date, 
      u.firstName, u.lastName, u.username, u.profileImg 
      from comments c join users u on c.userId = u.id where c.postId = ? order by c.id desc limit ?,?;`;

      const [result] = await db.execute(getQuery, [
        req.params.postId,
        req.params.idx,
        req.params.count,
      ]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  getCommentsLength: async (req, res) => {
    try {
      const getQuery = `select * from comments where postId = ?;`;

      const [result] = await db.execute(getQuery, [req.params.postId]);
      res.status(200).send(`${result.length}`);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  editComment: async (req, res) => {
    try {
      const { id, comment } = req.body;
      const updateQuery = `update comments set comment = ? where id = ?;`;

      await db.execute(updateQuery, [comment, id]);
      res.status(200).send("edited.");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  deleteComment: async (req, res) => {
    try {
      const deleteQuery = `delete from comments where id = ?;`;

      await db.execute(deleteQuery, [req.params.id]);
      res.status(200).send({ message: "deleted." });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
