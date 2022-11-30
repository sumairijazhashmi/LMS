const lms_db = require("../db_config/db");
const connectionString = require("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();

function seedData(query) {
    console.log("hello i am here in seed\n");
    return new Promise((resolve, reject) => {
        connectionString.query(query,
            (err2, result) => {
                if (err2) {
                    console.log("Seeding Failed");
                    reject(err2);
                }
                else {
                    resolve(result)
                    console.log("Seeding done");
                    console.log(result[0])
                }
            });
    });
}

const postFeedback = async (username, courseID, year, sem, score, res)=> {
    try {
        if (!username || !courseID || !year || !sem || !studentID) {
            return res.status(400).render("postFeedback", { message: "Please provide an ID and Passwords" });
        }
        // SELECT * FROM Attempts WHERE username = ? AND courseID = ? AND year = ? AND sem = ? AND studentID = ?

        lms_db.query("SELECT * FROM Attempts WHERE username = ? AND courseID = ? AND year = ? AND sem_offered = ? AND studentID = ?", [username, courseID, year, sem, studentID], async (err, results) => {
            if (results.length === 0) {
                res.status(401).render("postFeedback", { message: "Something ain't right bro" });
            }
            else {
                let score_query = `Update Attempts Set score="${score}" where username="${username} AND courseID= "${courseID}" AND year="${year}" AND sem_offered="${sem}" AND studentID="${studentID}"`;
                let x = await seedData(score_query);
                console.log("Score Updated");
            }
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    postFeedback
}