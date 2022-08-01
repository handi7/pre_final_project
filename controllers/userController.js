const db = require("../database").promise();
const { createToken } = require("../helper/createToken");
const Crypto = require("crypto");
const hbs = require("nodemailer-express-handlebars");
const transporter = require("../helper/nodemailer");
const path = require("path");
const jwt_decode = require("jwt-decode");

module.exports = {
  getUser: async (req, res) => {
    try {
      let scriptQuery = `select * from users where id = ?;`;
      const [result] = await db.execute(scriptQuery, [req.params.id]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  login: async (req, res) => {
    try {
      let { uNameOrEmail, password } = req.body;
      password = Crypto.createHmac("sha1", "hash123")
        .update(password)
        .digest("hex");
      const scriptQuery = `select * from users where username = ? or email = ?;`;

      const [result] = await db.execute(scriptQuery, [
        uNameOrEmail,
        uNameOrEmail,
      ]);

      if (result.length) {
        if (result[0].password === password) {
          let date = Date.now();
          const { id, email, isVerified } = result[0];

          const token = createToken({ id, email, isVerified, date });

          res.status(200).send({ data: result[0], token });
        } else {
          res.status(200).send("Password didn't match!");
        }
      } else {
        res.status(200).send("Username or Email not found!");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  keepLogin: async (req, res) => {
    try {
      const scriptQuery = `select * from users where email = ?;`;
      const decoded = jwt_decode(req.body.token);

      const [result] = await db.execute(scriptQuery, [decoded.email]);
      let date = Date.now();
      const { id, email, isVerified } = result[0];

      const token = createToken({ id, email, isVerified, date });

      res.status(200).send({ data: result[0], token });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  register: async (req, res) => {
    try {
      let { firstName, lastName, username, email, password } = req.body;
      password = Crypto.createHmac("sha1", "hash123")
        .update(password)
        .digest("hex");
      let checkUsername = `select * from users where username = ?;`;
      let checkEmail = `select * from users where email = ?;`;
      let insertQuery = `Insert into users (firstName, lastName, username, email, password) values (?,?,?,?,?);`;

      let [resultUsername] = await db.execute(checkUsername, [username]);
      let [resultEmail] = await db.execute(checkEmail, [email]);

      if (resultUsername.length && resultEmail.length)
        return res.status(200).send("usernameemail");
      if (resultUsername.length) return res.status(200).send("username");
      if (resultEmail.length) return res.status(200).send("email");

      const [result] = await db.execute(insertQuery, [
        firstName,
        lastName,
        username,
        email,
        password,
      ]);

      if (result.insertId) {
        let getQuery = `select * from users where id = ?;`;
        let updateQuery = `update users set token = ? where id = ?;`;
        let date = Date.now();
        let [data] = await db.execute(getQuery, [result.insertId]);
        const { id, email, isVerified } = data[0];

        const token = createToken({ id, email, isVerified, date });
        await db.execute(updateQuery, [token, result.insertId]);
        // point to the template folder
        const handlebarOptions = {
          viewEngine: {
            partialsDir: path.resolve("./views/"),
            defaultLayout: false,
          },
          viewPath: path.resolve("./views/"),
        };
        const mail = {
          from: `Capture <handev.co@gmail.com>`,
          to: `${email}`,
          subject: `Account Verification`,
          template: "email",
          context: {
            name: firstName,
            token: token,
          },
        };
        // use a template file with nodemailer
        transporter.use("compile", hbs(handlebarOptions));
        transporter.sendMail(mail);
        // return res.status(200).send(data);
        res.status(200).send({ dataLogin: data[0], token });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  resend: async (req, res) => {
    try {
      const { id, username, email, isVerified } = req.body;
      const date = Date.now();
      const token = createToken({ id, email, isVerified, date });
      const updateQuery = `update users set token = ? where id = ?;`;

      await db.execute(updateQuery, [token, id]);

      // point to the template folder
      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("./views/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views/"),
      };

      const mail = {
        from: `Capture <handev.co@gmail.com>`,
        to: `${email}`,
        subject: `Account Verification`,
        template: "email",
        context: {
          name: username,
          token: token,
        },
      };

      // use a template file with nodemailer
      transporter.use("compile", hbs(handlebarOptions));
      await transporter.sendMail(mail);
      res.status(200).send("Verification sent. Check your email.");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  getToken: async (req, res) => {
    try {
      const getQuery = `select * from users where token = ?;`;
      const [result] = await db.execute(getQuery, [req.params.token]);

      if (result.length < 1) {
        return res.status(200).send("error");
      }
      res.status(200).send("success");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  verification: async (req, res) => {
    try {
      const updateQuery = `update users set isVerified = 1, token = '' where id = ?;`;

      await db.execute(updateQuery, [req.user.id]);

      res.status(200).send("Verified");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  editData: async (req, res) => {
    try {
      let dataUpdate = [];
      for (let prop in req.body) {
        dataUpdate.push(`${prop} = ${db.escape(req.body[prop])}`);
      }

      const updateQuery = `update users set ${dataUpdate} where id = ?;`;
      const getQuery = `select * from users where id = ?;`;

      await db.execute(updateQuery, [req.params.id]);
      const [result] = await db.execute(getQuery, [req.params.id]);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  check: async (req, res) => {
    try {
      let dataCheck = [];
      for (let prop in req.body) {
        dataCheck.push(`${prop} = ${db.escape(req.body[prop])}`);
      }
      const checkQuery = `select * from users where ${dataCheck};`;

      const [result] = await db.execute(checkQuery);
      if (dataCheck[0].includes("username")) {
        if (result.length) {
          res.status(200).send("username error");
        } else {
          res.status(200).send("username success");
        }
      } else {
        if (result.length) {
          res.status(200).send("email error");
        } else {
          res.status(200).send("email success");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  sendReset: async (req, res) => {
    try {
      const getQuery = `select * from users where email = ?;`;
      const updateQuery = `update users set token = ? where id = ?;`;

      const [result] = await db.execute(getQuery, [req.body.email]);

      if (!result.length) {
        return res.status(200).send({ error: "Email not registered." });
      }
      const date = Date.now();
      const { id, email, isVerified } = result[0];
      const token = createToken({ id, email, isVerified, date });

      await db.execute(updateQuery, [token, id]);

      // point to the template folder
      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("./views/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views/"),
      };

      const mail = {
        from: `Capture <handev.co@gmail.com>`,
        to: `${email}`,
        subject: `Reset Password`,
        template: "reset",
        context: {
          token: token,
        },
      };

      // use a template file with nodemailer
      transporter.use("compile", hbs(handlebarOptions));
      await transporter.sendMail(mail);
      res.status(200).send({ success: "sent. Check your email." });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  checkLink: async (req, res) => {
    try {
      const getQuery = `select * from users where token = ?;`;

      const [result] = await db.execute(getQuery, [req.params.token]);

      if (result.length) return res.status(200).send(result[0]);
      res.status(200).send("0");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  reset: async (req, res) => {
    try {
      let { id, password } = req.body;
      password = Crypto.createHmac("sha1", "hash123")
        .update(password)
        .digest("hex");
      const updateQuery = `update users set password = ?, token = "" where id = ?;`;

      await db.execute(updateQuery, [password, id]);
      res.status(200).send("1");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
