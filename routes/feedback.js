const lms_db = require ("../db_config/db");
const connectionString = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();

function seedData(query)
{
    console.log("hello i am here in seed\n");
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

const feedback = async (courseID, year, sem, studentID) => {
    let query = `select assessment_ID, score from Attempts where student_ID = ${studentID} and course_ID = ${courseID} and year_offered = ${year} and sem_offered = "${sem}";`;
    let x = await seedData(query);
    return x;
}

module.exports = {
    feedback
}