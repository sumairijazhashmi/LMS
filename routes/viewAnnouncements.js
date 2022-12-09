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

const viewAnnouncements = async (courseID, year, sem, res) => {
    let query = `select heading, body_text, modified_date from Announcements where course_ID = ${courseID} and year_offered = ${year} and sem_offered = "${sem}";`;
    let x = await seedData(query);
    console.log("data fetched")
    return x;
}

module.exports = {
    viewAnnouncements
}