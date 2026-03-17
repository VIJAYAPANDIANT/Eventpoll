const { Router } = require("express")
const { pool } = require("../config/db")
const userController = Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validateEmail, generateToken, decryptToken } = require("../utils/utils");

// User signup api
userController.post("/signup", async (req, res) => {
    const { email, fullName, password } = req.body;

    const valideMail = validateEmail(email);
    const role = "user"

    if (valideMail === false) {
        return res.status(401).send({ msg: "Invalid email address !" });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            return res.status(403).send({ msg: "User already exists" });
        }

        bcrypt.hash(password, 5, async function (err, hash) {
            if (err) {
                return res.status(400).send({ msg: "Something went wrong, plz try again later" })
            }
            try {
                const { rows: insertedRows } = await pool.query(
                    'INSERT INTO users (email, fullName, password, userRole, pollsCreated, templateCreated, pollsAttended) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                    [email, fullName, hash, role, JSON.stringify([]), JSON.stringify([]), JSON.stringify([])]
                );

                const token = generateToken({
                    userId: insertedRows[0].id,
                    email: email,
                    fullName: fullName,
                    role: role
                })
                res.status(200).json({ msg: "Signup successful", token, email: email, fullName: fullName, role: role })
            }
            catch (err) {
                console.error(err);
                res.status(400).send({ msg: "Insert error: " + err.message })
            }
        });
    } catch (err) {
        console.error(err);
        res.status(400).send({ msg: "Select error: " + err.message })
    }
});

// API for fetching details of the user
userController.get("/user-details", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ msg: "Please login again" })
    }
    const token = req.headers.authorization.split(" ")[1]

    const userToken = decryptToken(token);
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userToken.userId]);
        if (rows.length > 0) {
            const user = rows[0];
            res.status(200).send({
                msg: "success",
                userDetails: {
                    email: user.email,
                    fullName: user.fullname, // pg lowercases column names if not quoted
                    userRole: user.userrole,
                    pollsCreated: user.pollscreated,
                    pollsAttended: user.pollsattended,
                    templateCreated: user.templatecreated
                }
            });
        } else {
            res.status(400).send({ msg: "Something went wrong while getting user details" });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ msg: "Something went wrong while getting user details" });
    }
})

module.exports = {
    userController
}
