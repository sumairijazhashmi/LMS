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

const postFeedback = async (username, courseID, year, sem, assessmentID, score, res)=> {
    try {
        console.log("hello i am here in postFeedback\n");
        if (!username || !courseID || !year || !sem || !score) {
            return res.status(400).render("postFeedback", { message: "Please provide an ID and Passwords" });
        }
        // select everything from Attempts table and console.log it
        let query = `select * from Attempts`;
        let x = await seedData(query);
        console.log(x);
        lms_db.query("SELECT * FROM Attempts WHERE student_id = ? AND course_id = ? AND year_offered = ? AND sem_offered = ? AND assessment_id ", [username, courseID, year, sem, assessmentID], async (err, results) => {
            if (results.length === 0) {
                res.status(401).render("postFeedback", { message: "Something ain't right bro" });
            }
            else {
                let score_query = `Update Attempts Set score="${score}" where student_id = ${username} and course_id = ${courseID} and year_offered = ${year} and sem_offered = "${sem}" and assessment_id = ${assessmentID};`;
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