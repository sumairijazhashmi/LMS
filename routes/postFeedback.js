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

const postFeedback = async (username, courseID, year, sem, filename, score, res)=> {
    try {
        console.log("hello i am here in postFeedback\n");
        if (!username || !courseID || !year || !sem || !score) {
            return res.status(400).render("postFeedback", { message: "Please provide an ID and Passwords" });
        }
        //  // Schema for attempts table:
    // student_id | course_id | year_offered | sem_offered | ass_data | submitted_attachment| score |
        lms_db.query("SELECT * FROM Attempts WHERE ass_data = ? and student_ID = ?", [`${courseID}-${year}-${sem}-${filename}`, username], async (error, results) => {
            if (results.length === 0) {
                res.status(401).render("postFeedback", { message: "Incorrect Information Entered" });
            }
            else {
                let score_query = `Update Attempts Set score="${score}" where ass_data = "${courseID}-${year}-${sem}-${filename}" and student_ID = ${username};`;
                let x = await seedData(score_query);
                console.log("Score Updated");
                // send back to home page
                res.status(200).redirect("/instructorhome");
            }
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    postFeedback
}