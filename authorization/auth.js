const lms_db = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')


const login = async (username,password, res) => {
    try {
        if (!username || !password) {
            return res.status(400).render("main", {message: "Please provide an email and password"});
        }

        lms_db.query("SELECT * FROM accounts WHERE username = ?", [username], async (error, results) => {
            if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render("main", {message: "Username or Password is incorrect"});
            } 
            else {
                const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 1000),
                    httpOnly: true
                });
                res.status(200).redirect("home");
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const createAccount = async (username,password, email, role, res) => {
    try {
        if (!username || !password) {
            return res.status(400).render("create_account", {message: "Please provide an email and password"});
        }

        lms_db.query("SELECT * FROM accounts WHERE username = ?", [username], async (error, results) => {
            if (results.length > 0) {
                return res.status(400).render("create_account", {message: "That username is already in use"});
            }
            else if (password.length < 8) {
                return res.status(400).render("create_account", {message: "Password should be at least 8 characters long"});
            }
            let hashedPassword = await bcrypt.hash(password, 8);
            
            lms_db.query("INSERT INTO accounts SET ?", {username: username, password: hashedPassword, role: role}, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    return res.status(201).render("create_account", {message: "User registered"});
                }
            });
            // check if user role is instructor then also insert record in instructor table. and if it is student then insert in students table
            if (role == "Instructor") {
                lms_db.query("INSERT INTO instructor SET ?", {username: username, email: email, password: hashedPassword}, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        return res.status(201).render("create_account", {message: "User registered"});
                    }
                });
            }
            else if (role == "Student") {
                lms_db.query("INSERT INTO student SET ?", {username: username, email: email, password: hashedPassword}, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        return res.status(201).render("create_account", {message: "User registered"});
                    }
                });
            }

        });
    } catch (error) {
        console.log(error);
    }
};

const verifyToken = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/");
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect("/");
    }
};


module.exports = {
    login,
    createAccount,
    verifyToken
};


