const lms_db = require ("../db_config/db");
const connectionString = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();

function seedData(query)
{
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

const addCourse = async (courseName, courseCode, res) => {
    try 
    {
        if (!username || !oldPass || !newPass || !rePass) {
            return res.status(400).render("updatePassword", {message: "Please provide Course Name or Course Code"});
        }

        else
        {
            let query = `Insert into Course (year, semester, name, credit_hrs) values("${userName}","${password1}", "${radio}","${email}", "${name1}")`;
            await seedData(query);
        }

        
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    addCourse
};


