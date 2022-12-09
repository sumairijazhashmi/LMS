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

const feedback = async (courseID, year, sem, studentID, res) => {
    // insert into Attempts table
    // insert into assisgnment table
    // let query0 = `insert into Assignments (student_ID, course_ID, year_offered, sem_offered, assessment_id) values (${studentID}, ${courseID}, ${year}, "${sem}", 50);`;
    // let query1 = `insert into Attempts (student_ID, course_ID, year_offered, sem_offered, assessment_id) values (${studentID}, ${courseID}, ${year}, "${sem}" , 50);`;
    // await seedData(query1);
    let query = `select ass_data, score from Attempts where ass_data like '${courseID}-${year}-${sem}-%' and student_ID = ${studentID};`;
    let x = await seedData(query);
    return x;
}

module.exports = {
    feedback
}