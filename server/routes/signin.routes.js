const { Router } = require("express");
const authController = Router();
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

const {
  generateToken,
  validateEmail,
} = require("../utils/utils");

//<-------------------------------   APT for sign in   ------------------------------->

authController.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const validEmail = validateEmail(email);
  if (validEmail) {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (rows.length > 0) {
        const user = rows[0];
        const hash = user.password;
        if (hash) {
          const verification = await bcrypt.compare(password, hash);
          if (verification) {
            const token = generateToken({
              userId: user.id,
              email: user.email,
              fullName: user.fullname,
              role: user.userrole,
            });
            res.status(200).send({
              msg: "Signed in successfully",
              email: user.email,
              fullName: user.fullname,
              role: user.userrole,
              token,
            });
          } else {
            res.status(401).send({ msg: "Please enter a valid password." });
          }
        } else {
          res.status(401).send({ msg: "Please enter a valid password." });
        }
      } else {
        res.status(404).send({
          msg: "The account you mentioned does not exist. Please try with correct email address.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(400).send({ msg: "Something went wrong, plz try again" });
    }
  } else res.status(401).send({ msg: "Please enter a valid email address." });
});

module.exports = authController;
