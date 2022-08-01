const db = require("../database").promise();

module.exports = {
  getLiked: async (req, res) => {
    try {
      let getQuery = `select * from likes where userLikeId = ?;`;

      const [result] = await db.execute(getQuery, [req.params.id]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  isLiked: async (req, res) => {
    try {
      const { postId, userId } = req.params;
      let getQuery = `select count(likeId) > 0 as isLiked 
      from likes where postId = ? and userLikeId = ?;`;

      const [result] = await db.execute(getQuery, [postId, userId]);
      res.status(200).send(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  postLikes: async (req, res) => {
    try {
      const getQuery = `select count(likeId) as postLikes from likes where postId = ?;`;
      const [result] = await db.execute(getQuery, [req.params.postId]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  addLike: async (req, res) => {
    try {
      const { postId, userId } = req.body;
      let insertQuery = `insert into likes values (null,?, ?);`;

      const [result] = await db.execute(insertQuery, [postId, userId]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  delete: async (req, res) => {
    try {
      const { postId, userId } = req.params;
      const deleteQuery = `delete from likes where postId = ? and userLikeId = ?;`;

      const [result] = await db.execute(deleteQuery, [postId, userId]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
