const { Router } = require("express");
const templateController = Router();
const { pool } = require("../config/db");
const { decryptToken } = require("../utils/utils");

// <----------------------------// API for storing template into PostgreSQL --------------------->
templateController.post("/save-template", async (req, res) => {
    if (!req.headers.authorization) {
        return res.send("Please login again")
    }
    const token = req.headers.authorization.split(" ")[1]
    const user = decryptToken(token);
    const { templateName, questions } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO templates (adminId, templateName, questions) VALUES ($1, $2, $3) RETURNING id',
            [user.userId, templateName, JSON.stringify(questions)]
        );
        const templateId = rows[0].id;

        // Fetch current user details to update templateCreated
        const { rows: userRows } = await pool.query('SELECT templateCreated FROM users WHERE id = $1', [user.userId]);
        if (userRows.length > 0) {
            let templateCreated = userRows[0].templatecreated;
            templateCreated.push({ templateId, templateName });

            await pool.query('UPDATE users SET templateCreated = $1 WHERE id = $2', [JSON.stringify(templateCreated), user.userId]);
        }

        res.status(200).json({ msg: "Template saved successfully" })
    }
    catch (err) {
        console.error(err);
        res.status(400).send({ msg: "Something went wrong, please try again" });
    }
})

// <----------------------------// API for fetching template from PostgreSQL created by that user--------------------->
templateController.get("/get-template/:templateId", async (req, res) => {
    if (!req.headers.authorization) {
        return res.send("Please login again")
    }
    const { templateId } = req.params;
    const token = req.headers.authorization.split(" ")[1]
    const user = decryptToken(token);
    try {
        const { rows } = await pool.query('SELECT * FROM templates WHERE id = $1', [templateId]);
        if (rows.length > 0) {
            const template = rows[0];
            if (user.userId == template.adminid) {
                res.status(200).send({
                    msg: "success",
                    template: {
                        ...template,
                        templateName: template.templatename,
                        adminId: template.adminid,
                        questions: template.questions
                    }
                });
            } else {
                res.status(401).send({ msg: "Unauthorized access" })
            }
        } else {
            res.status(404).send({ msg: "Template not found" })
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ msg: "Something went wrong while getting template" });
    }
})

module.exports = { templateController }
