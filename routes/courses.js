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

const addCourse = async (courseName, courseCode, instructor, year, semmester, credit_hrs, res) => {
    try 
    {
        if (!courseName || !courseCode ) {
            return res.status(400).render("addNewCourse", {message: "Please provide Course Name or Course Code"});
        }

        else
        {
            let query = `Insert into Course (course_id, year_offered, sem_offered, name, credit_hrs, instructor) values("${courseCode}", "${year}", "${semmester}","${courseName}", "${credit_hrs}", "${instructor}");`;
            await seedData(query);
        }

        res.redirect("/adminHome");

        
    } catch (error) {
        console.log(error);
    }
};

const delCourse = async (courseName, courseCode, res) => {
    try 
    {
        if (!courseName || !courseCode ) {
            return res.status(400).render("removeExistingCourse", {message: "Please provide Course Name or Course Code"});
        }

        else
        {
            let account_query = `Delete from Course where course_id="${courseCode}";`;
            let x= await seedData(account_query);
            console.log("Delete course")
        }

        res.redirect("/adminHome");

        
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    addCourse, delCourse
};


