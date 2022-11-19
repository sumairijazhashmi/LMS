const lms_db = require ("../db_config/db");
const connectionString = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();

function seedData(query)
{
    /*
    Call this fuction to  insert a record into your db to the respective table using 
    the query.The variable query corresponds to the sql query you will write to accomplish this. 
     */
    return new Promise((resolve, reject)=>{
      connectionString.query(query,
      (err2,result)=>
      {
          if(err2)
          {
              console.log("Seeding Failed");
              reject(err2);
          }
          else
          {
              resolve(result)
              console.log("Seeding done");
              console.log(result[0])
          }
       });
      });
}

const updatePass = async (username, oldPass, newPass, rePass, res) => {
    try {
        if (!username || !oldPass || !newPass || !rePass) {
            return res.status(400).render("updatePassword", {message: "Please provide an ID and Passwords"});
        }

        lms_db.query("SELECT * FROM Account WHERE username = ?", [username], async (error, results) => {
            // if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            //     res.status(401).render("main", {message: "Username or Password is incorrect"});
            // } 
    
            if (results.length === 0 || oldPass != results[0].password) {
                res.status(401).render("updatePassword", {message: "Username or Old Password is incorrect"});
            } 
            else {
                if (newPass === rePass)
                {
                    let account_query = `Update Account Set password="${newPass}" where username="${username}";`;
                    let x = await seedData(account_query);
                    console.log("Password Updated")
                    if (results[0].role == 'instructor')
                    {
                        let account_query = `Update Instructor Set password="${newPass}" where instructor_id="${username}";`;
                        let x = await seedData(account_query);
                        res.redirect("/instructorhome");
                    }
                    else if (results[0].role == 'admin')
                    {
                        let account_query = `Update Admin Set password="${newPass}" where admin_id="${username}";`;
                        let x = await seedData(account_query);
                        res.redirect("/adminHome");
                    }
                    else if (results[0].role == 'student')
                    {
                        let account_query = `Update Student Set password="${newPass}" where student_id="${username}";`;
                        let x = await seedData(account_query);
                        res.redirect("/studenthome");
                    }
                }
                else 
                {
                    res.status(401).render("updatePassword", {message: "New Password is incorrectly re-enterd!"});   
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    updatePass
};


