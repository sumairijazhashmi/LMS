const lms_db = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();
// require dotenv



const login = async (username,password, res) => {
    try {
        if (!username || !password) {
            return res.status(400).render("main", {message: "Please provide an email and password"});
        }

        lms_db.query("SELECT * FROM Account WHERE username = ?", [username], async (error, results) => {
            // if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            //     res.status(401).render("main", {message: "Username or Password is incorrect"});
            // } 
    
            if (results.length === 0 || password != results[0].password) {
                res.status(401).render("main", {message: "Username or Password is incorrect"});
            } 
            else {
                const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES*60* 1000),
                    httpOnly: true
                });
                res.status(200).redirect("home");
            }
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    login
};


