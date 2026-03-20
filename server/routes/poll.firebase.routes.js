"use strict";
const { Router } = require("express");
const firebaseController = Router();
const {firebase} = require('../config/db');
const { pool } = require("../config/db");
const { pollDataToUser,decryptToken, pollToArray} = require("../utils/utils");
const fireDb = firebase.database(); 
const bodyParser = require('body-parser');
const express = require("express")

const app = express();
app.use(express.json());

firebaseController.post("/create-poll", async (req, res) => {
  const { pollName, topic, topicImage, questions, pollStatus, pollCreatedAt, pollEndsAt } =
    req.body;

  if (!req.headers.authorization) {
    return res.send("Please login again");
  } else {
    const pollRef = fireDb.ref("polls").push();
    const pollId = pollRef.key;
    const token = req.headers.authorization.split(" ")[1];
    const userToken = decryptToken(token);
    
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [userToken.email]);
    if (rows.length === 0) {
      return res.status(404).send("User not found");
    }
    const user = rows[0];
    const userRole = user.userrole;
    const adminId = user.id;

    if (userRole !== "admin" && userRole !== "user") {
      res.send("Please login to create a poll");
    } else {
      // Update pollsCreated in PostgreSQL
      let pollsCreated = user.pollscreated || [];
      pollsCreated.push({ pollId: pollId });
      await pool.query('UPDATE users SET pollsCreated = $1 WHERE id = $2', [JSON.stringify(pollsCreated), adminId]);
      
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const pollUrl = `${frontendUrl}/event/${pollId}`;
      const formattedQuestions = (questions || []).map((question) => {
        const questionRef = pollRef.child("questions").push();
        const questionId = questionRef.key;
        
        let questionData = {
          question: question.question,
          maxSelections: question.maxSelections || 1,
          type: question.type || "single",
          totalVotes: 0,
        };

        if (question.type === "imagechoice") {
          const formattedOptions = (question.options || []).map((option) => {
            const optionRef = questionRef.child("options").push();
            const optionId = optionRef.key;
            return {
              [optionId]: {
                option: option.option || "",
                image: option.image || "",
                votes: 0,
              },
            };
          });
          questionData.options = Object.assign({}, ...formattedOptions);
        } else if (question.type === "open-ended") {
          questionData.responses = [];
          // Open ended doesn't have options in the traditional sense
        } else {
          // Default single/multi choice
          const formattedOptions = (question.options || []).map((option) => {
            const optionRef = questionRef.child("options").push();
            const optionId = optionRef.key;
            return {
              [optionId]: {
                option,
                votes: 0,
              },
            };
          });
          questionData.options = Object.assign({}, ...formattedOptions);
        }

        return { [questionId]: questionData };
      });

      const questionsData = Object.assign({}, ...formattedQuestions);
      const pollData = {
        pollName,
        topic: topic || "General",
        topicImage: topicImage || "",
        pollId,
        questions: questionsData,
        pollStatus: pollStatus || "live",
        adminId: adminId.toString(),
        pollCreatedAt,
        pollEndsAt,
        pollUrl,
      };

      pollRef
        .set(pollData)
        .then(() => {
          res.status(201).json({
            message: "Poll created successfully",
            pollData,
            url: pollUrl,
          });
        })
        .catch((error) => {
          console.error("Firebase Error:", error);
          res.status(500).json({ message: "Failed to create poll" });
        });
    }
  }
});

firebaseController.post("/vote", async (req, res) => {
  const { pollId, selectedAnswers, pollData, pollName } = req.body;
  if (!req.headers.authorization) {
    return res.status(401).send("Please login again");
  } else {
    const token = req.headers.authorization.split(" ")[1];
    const userToken = decryptToken(token);
    
    // Replace legacy UserModel with PostgreSQL pool query
    const { rows: userRows } = await pool.query('SELECT * FROM users WHERE email = $1', [userToken.email]);
    const user = userRows[0];
    const userId = user?.id;

    if (!userId) {
      res.status(400).send("User not found");
    } else {
      const pollRef = firebase.database().ref("polls/" + pollId);

      pollRef.child("usersAttended").once("value", async function (snapshot) {
        const usersAttended = snapshot.val() || [];

        if (Object.values(usersAttended).includes(userId.toString())) {
          res.status(208).send("User already voted for this poll");
        } else {
          pollRef.child("usersAttended").push(userId.toString());

          // Update pollsAttended in PostgreSQL
          let pollsAttended = user.pollsattended || [];
          pollsAttended.push({
            pollData: pollData,
            pollName: pollName,
            pollId: pollId,
          });
          await pool.query('UPDATE users SET pollsAttended = $1 WHERE id = $2', [JSON.stringify(pollsAttended), userId]);

          pollRef.once("value", (snapshot) => {
            const pollData = snapshot.val();

            for (const selectedAnswer of selectedAnswers) {
              const { questionId, optionsIds } = selectedAnswer;
              const question = pollData.questions[questionId];
              
              if (question.type === "openended") {
                if (!question.responses) {
                  question.responses = [];
                }
                question.responses.push({
                  text: optionsIds[0],
                  email: userToken.email,
                  userId: userId.toString(),
                  fullName: user.fullname
                });
              } else {
                const options = optionsIds.map(
                  (optionId) => question.options[optionId]
                );
                options.forEach((option) => {
                  option.votes++;
                  if (!option.votedBy) {
                    option.votedBy = [];
                  }
                  option.votedBy.push({
                    email: userToken.email,
                    userId: userId.toString(),
                    fullName: user.fullname
                  });
                });
              }
              question.totalVotes++;
            }

            pollRef
              .update(pollData)
              .then(() => {
                res.status(200).send("Vote recorded successfully");
              })
              .catch((error) => {
                res.status(500).send(`Error recording vote: ${error}`);
              });
          });
        }
      });
    }
  }
});

firebaseController.get("/live-polls", async (req, res) => {
  try {
    const snapshot = await fireDb.ref("polls").once("value");
    const pollsObject = snapshot.val();
    const newPoll = pollToArray(pollsObject);

    if (!req.headers.authorization) {
      return res.send("Please login again");
    } else {
      const token = req.headers.authorization.split(" ")[1];
      const userToken = decryptToken(token);
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [userToken.email]);
    if (rows.length === 0) {
      return res.status(404).send("User not found");
    }
    const userRole = rows[0].userrole;
    if (userRole !== "admin" && userRole !== "user") {
      res.send("Please login to see your polls");
    } else {
      const adminId = rows[0].id.toString();
      const filteredPolls = newPoll.filter(
        (poll) => poll.adminId === adminId
      );
      res.json(filteredPolls);
    }
    }
  } catch (error) {
    res.status(500).send("Failed to retrieve poll data.");
  }
});

firebaseController.get("/live-poll/:pollId", async (req, res) => {
  const pollId = req.params.pollId;
  if (!req.headers.authorization) {
    return res.status(401).send("Please login again");
  } else {
    fireDb.ref(`polls/${pollId}`).once(
      "value",
      (snapshot) => {
        const pollData = snapshot.val();
         if (!pollData) {
          res.status(404).send("Poll not found");
          return;
        }
        const newPoll = pollDataToUser(pollData);
        res.json(newPoll);
      },
      (error) => {
        res.status(500).send("Internal Server Error");
      }
    );
  }
});


  
module.exports = {
  firebaseController,
};
