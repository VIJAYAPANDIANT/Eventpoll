const { Router } = require("express");
const pollController = Router();
const { pool } = require("../config/db");
const ExcelJS = require('exceljs');
const { votedByData, decryptToken, pollToArray } = require("../utils/utils");

// <----------------------------// API for storing ended poll into PostgreSQL----------------->
pollController.post("/save-poll", async (req, res) => {
    const { pollId, adminId, pollName, topic, templateName, questions, usersAttended, pollCreatedAt, pollEndsAt } = req.body;

    try {
        await pool.query(
            'INSERT INTO polls (pollId, adminId, pollName, topic, templateName, questions, pollStatus, usersAttended, pollCreatedAt, pollEndsAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [
                pollId,
                adminId,
                pollName,
                topic,
                templateName,
                JSON.stringify(questions),
                false,
                JSON.stringify(usersAttended || []),
                pollCreatedAt,
                pollEndsAt
            ]
        );
        res.status(200).json({ msg: "Poll Details saved successfully" })
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to save poll to PostgreSQL');
    }
});

pollController.get('/ended-polls', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send("Please login again")
        }
        else {
            const token = req.headers.authorization.split(" ")[1]
            const userToken = decryptToken(token);

            const { rows: userRows } = await pool.query('SELECT * FROM users WHERE email = $1', [userToken.email]);
            if (userRows.length === 0) {
                return res.status(404).send("User not found");
            }
            const user = userRows[0];
            const userRole = user.userrole;

            if (userRole !== "admin" && userRole !== "user") {
                res.status(403).send("Please login to see your polls")
            }
            else {
                const adminId = user.id;
                const { rows: endedPolls } = await pool.query('SELECT * FROM polls WHERE adminId = $1', [adminId.toString()]);
                // PostgreSQL returns JSONB fields as objects
                res.send(endedPolls.map(p => ({
                    ...p,
                    pollId: p.pollid,
                    adminId: p.adminid,
                    pollName: p.pollname,
                    templateName: p.templatename,
                    pollStatus: p.pollstatus,
                    pollCreatedAt: p.pollcreatedat,
                    pollEndsAt: p.pollendsat,
                    questions: p.questions,
                    usersAttended: p.usersattended
                })));
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve poll data.');
    }
});

pollController.post('/polls/votedBy', async (req, res) => {
    try {
        const { pollId, questionId, optionId } = req.body;
        const { rows } = await pool.query('SELECT * FROM polls WHERE pollId = $1', [pollId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        const poll = rows[0];
        const questions = poll.questions;

        const question = questions.find(q => q._id?.toString() === questionId || q.id?.toString() === questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const option = question.options.find(o => o._id?.toString() === optionId || o.id?.toString() === optionId);
        if (!option) {
            return res.status(404).json({ error: 'Option not found' });
        }

        const votedBy = option.votedBy;
        res.status(200).json(votedBy);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

pollController.get('/download/votedby/:pollId/question/:questionId/option/:optionId', async (req, res) => {
    const pollId = req.params.pollId;
    const questionId = req.params.questionId;
    const optionId = req.params.optionId;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Voters');

    worksheet.columns = [
        { header: 'Email', key: 'email', width: 50 },
        { header: 'Full Name', key: 'fullName', width: 50 },
        { header: 'User ID', key: 'userId', width: 50 },
    ];

    try {
        const { rows } = await pool.query('SELECT * FROM polls WHERE pollId = $1', [pollId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        const poll = rows[0];
        const questions = poll.questions;

        const question = questions.find(q => q._id?.toString() === questionId || q.id?.toString() === questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const option = question.options.find(o => o._id?.toString() === optionId || o.id?.toString() === optionId);
        if (!option) {
            return res.status(404).json({ error: 'Option not found' });
        }

        const votedBy = option.votedBy;
        votedBy.forEach(user => {
            worksheet.addRow(user);
        });

        res.setHeader('Content-Disposition', 'attachment; filename="voters.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = { pollController }
